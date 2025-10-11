using ASI.Basecode.Data;
using ASI.Basecode.Data.EFCore;
using ASI.Basecode.Data.Interfaces;
using ASI.Basecode.Data.Repositories;
using ASI.Basecode.Services.Interfaces;
using ASI.Basecode.Services.ServiceModels;
using ASI.Basecode.Services.Services;
using ASI.Basecode.WebApp.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc.Infrastructure;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;

namespace ASI.Basecode.WebApp
{
    // Other services configuration
    internal partial class StartupConfigurer
    {
        /// <summary>
        /// Configures the other services.
        /// </summary>
        private void ConfigureOtherServices()
        {
            // Framework
            this._services.TryAddSingleton<IHttpContextAccessor, HttpContextAccessor>();
            this._services.TryAddSingleton<IActionContextAccessor, ActionContextAccessor>();

            // Common
            this._services.AddScoped<IUnitOfWork>(provider =>
            {
                var context = provider.GetRequiredService<AsiBasecodeDBContext>();
                return new UnitOfWork<AsiBasecodeDBContext>(context, context);
            });

            // Services
            this._services.AddScoped<IUserService, UserService>();
            this._services.AddScoped<ICourseService, CourseService>();
            this._services.AddScoped<IRbacService, RbacService>();
            this._services.AddScoped<IGradeFeedbackService, GradeFeedbackService>();

            // Repositories
            this._services.AddScoped<IUserRepository, UserRepository>();
            this._services.AddScoped<ICourseRepository, CourseRepository>();
            this._services.AddScoped<IGradeFeedbackRepository, GradeFeedbackRepository>();
            this._services.AddScoped<IStudentCourseRepository, StudentCourseRepository>();


            // Manager Class
            this._services.AddHttpClient();

            

            // Add CORS services
            this._services.AddCors(options =>
            {
                options.AddPolicy("AllowSpecificOrigin", policy =>
                {
                    policy.WithOrigins("http://localhost:5173")
                        .AllowAnyHeader()
                        .AllowAnyMethod();
                });
                
                // Add other policies as needed
                options.AddPolicy("AllowDevelopment", policy =>
                {
                    policy.AllowAnyOrigin()
                        .AllowAnyHeader()
                        .AllowAnyMethod();
                });
            });
        }
    }
}
