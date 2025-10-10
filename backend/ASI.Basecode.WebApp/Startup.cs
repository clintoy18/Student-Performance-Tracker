using ASI.Basecode.Data;
using ASI.Basecode.Resources.Constants;
using ASI.Basecode.Services.Manager;
using ASI.Basecode.WebApp.Extensions.Configuration;
using ASI.Basecode.WebApp.Models;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.FileProviders;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System;
using System.IO;
using System.Text;

namespace ASI.Basecode.WebApp
{
    /// <summary>
    /// For configuring services on application startup.
    /// </summary>
    /// <remarks>
    /// <para>Method call sequence for instances of this class:</para>
    /// <para>1. constructor</para>
    /// <para>2. <see cref="ConfigureServices(IServiceCollection)"/></para>
    /// <para>3. (create <see cref="IApplicationBuilder"/> instance)</para>
    /// <para>4. <see cref="ConfigureApp(IApplicationBuilder, IWebHostEnvironment)"/></para>
    /// </remarks>
    internal partial class StartupConfigurer
    {
        /// <summary>
        /// Gets the configuration.
        /// </summary>
        private IConfiguration Configuration { get; }

        private IApplicationBuilder _app;

        private IWebHostEnvironment _environment;

        private IServiceCollection _services;

        /// <summary>
        /// Initialize new <see cref="StartupConfigurer"/> instance using <paramref name="configuration"/>
        /// </summary>
        /// <param name="configuration"></param>
        public StartupConfigurer(IConfiguration configuration)
        {
            this.Configuration = configuration;

            PathManager.Setup(this.Configuration.GetSetupRootDirectoryPath());

            var token = this.Configuration.GetTokenAuthentication();
            this._signingKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(token.SecretKey));
            this._tokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = this._signingKey,
                ValidateIssuer = true,
                ValidIssuer = Const.Issuer,
                ValidateAudience = true,
                ValidAudience = token.Audience,
                ValidateLifetime = true,
                ClockSkew = TimeSpan.Zero
            };

            PasswordManager.SetUp(this.Configuration.GetSection("TokenAuthentication"));
            Encoding.RegisterProvider(CodePagesEncodingProvider.Instance);
        }

        /// <summary>
        /// Use this method to add services to the container.
        /// </summary>
        /// <param name="services">Services</param>
        public void ConfigureServices(IServiceCollection services)
        {
            this._services = services;

            services.AddMemoryCache();

            // Register SQL database configuration context as services.
            services.AddDbContext<AsiBasecodeDBContext>(options =>
                options
                    .UseSqlite(
                        Configuration.GetConnectionString("DefaultConnection")
                        // b => b.MigrationsAssembly("ASI.Basecode.WebApp")
                    )
            );

            // services.AddControllersWithViews();
            // services.AddRazorPages().AddRazorRuntimeCompilation();
            services.AddControllers();

            // Add Swagger/OpenAPI support with JWT Bearer authentication
            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new Microsoft.OpenApi.Models.OpenApiInfo { Title = "API", Version = "v1" });
                var securityScheme = new Microsoft.OpenApi.Models.OpenApiSecurityScheme
                {
                    Name = "Authorization",
                    Type = Microsoft.OpenApi.Models.SecuritySchemeType.Http,
                    Scheme = "bearer",
                    BearerFormat = "JWT",
                    In = Microsoft.OpenApi.Models.ParameterLocation.Header,
                    Description = "JWT Authorization header using the Bearer scheme. Example: 'Bearer {token}'"
                };
                c.AddSecurityDefinition("Bearer", securityScheme);
                c.AddSecurityRequirement(new Microsoft.OpenApi.Models.OpenApiSecurityRequirement
                {
                    {
                        securityScheme,
                        new string[] {}
                    }
                });
                var xmlFile = $"{System.Reflection.Assembly.GetExecutingAssembly().GetName().Name}.xml";
                var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
                if (File.Exists(xmlPath))
                {
                    c.IncludeXmlComments(xmlPath);
                }
            });

            // DI Services AutoMapper(Add Profile)
            this.ConfigureAutoMapper();

            // DI Services
            this.ConfigureOtherServices();

            // Authorization (Add Policy)
            this.ConfigureAuthorization();

            services.Configure<FormOptions>(options =>
            {
                options.ValueLengthLimit = 1024 * 1024 * 100;
            });

            services.AddSingleton<IFileProvider>(
                new PhysicalFileProvider(
                    Path.Combine(Directory.GetCurrentDirectory(), "wwwroot")));
        }

        /// <summary>
        /// Configure application
        /// </summary>
        /// <param name="app"></param>
        /// <param name="env"></param>
        public void ConfigureApp(IApplicationBuilder app, IWebHostEnvironment env)
        {
            this._app = app;
            this._environment = env;

            if (!this._environment.IsDevelopment())
            {
                this._app.UseHsts();
            }

            this.ConfigureLogger();

            if (!this._environment.IsDevelopment())
            {
                this._app.UseHttpsRedirection();
            }
            
            // this._app.UseStaticFiles();      // Not needed I think

            // Enable Swagger middleware
            this._app.UseSwagger();
            this._app.UseSwaggerUI(c =>
            {
                c.SwaggerEndpoint("/swagger/v1/swagger.json", "API V1");
                c.RoutePrefix = "swagger"; // Access at /swagger
            });

            // Localization
            var options = this._app.ApplicationServices.GetService<IOptions<RequestLocalizationOptions>>();
            this._app.UseRequestLocalization(options.Value);

            // Add CORS middleware HERE (before UseRouting)
            this._app.UseCors("AllowSpecificOrigin");
            this._app.UseRouting();

            this._app.UseAuthentication();
            this._app.UseAuthorization();
        }
    }
}
