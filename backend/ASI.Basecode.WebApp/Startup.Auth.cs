using ASI.Basecode.WebApp.Extensions.Configuration;
using ASI.Basecode.Resources.Constants;
using ASI.Basecode.WebApp.Services;
using ASI.Basecode.Services.Interfaces;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Text;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace ASI.Basecode.WebApp
{
    // Authorization configuration
    internal partial class StartupConfigurer
    {
        private readonly SymmetricSecurityKey _signingKey;
        private readonly TokenValidationParameters _tokenValidationParameters;

        /// <summary>
        /// Configure authorization
        /// </summary>
        // Updated ConfigureAuthorization method in StartupConfigurer
        private void ConfigureAuthorization()
        {
            var token = Configuration.GetTokenAuthentication();
            var signingKey = new SymmetricSecurityKey(
                Encoding.ASCII.GetBytes(token.SecretKey)
            );

            var tokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = signingKey,
                ValidateIssuer = true,
                ValidIssuer = Const.Issuer,
                ValidateAudience = true,
                ValidAudience = token.Audience,
                ValidateLifetime = true,
                ClockSkew = TimeSpan.Zero
            };

            this._services.AddAuthentication(options =>
                {
                    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
                })
                .AddJwtBearer(JwtBearerDefaults.AuthenticationScheme, options =>
                {
                    options.TokenValidationParameters = tokenValidationParameters;
                    options.SaveToken = true;
                    options.Events = new JwtBearerEvents
                    {
                        OnMessageReceived = context =>
                        {
                            // Read token from Authorization header (for localStorage)
                            var authHeader = context.Request.Headers["Authorization"].FirstOrDefault();
                            if (!string.IsNullOrEmpty(authHeader) && authHeader.StartsWith("Bearer "))
                            {
                                context.Token = authHeader.Substring("Bearer ".Length).Trim();
                            }

                            // Fallback to cookie if needed
                            if (string.IsNullOrEmpty(context.Token))
                            {
                                context.Token = context.Request.Cookies["accessToken"];
                            }

                            return Task.CompletedTask;
                        },
                        OnAuthenticationFailed = context =>
                        {
                            Console.WriteLine($"Authentication failed: {context.Exception.Message}");
                            return Task.CompletedTask;
                        },
                        OnChallenge = async context =>
                        {
                            context.HandleResponse(); // Prevent default behavior

                            context.Response.StatusCode = StatusCodes.Status401Unauthorized;
                            context.Response.ContentType = "application/json";

                            await context.Response.WriteAsJsonAsync(new
                            {
                                error = "Unauthorized",
                                message = "Authentication failed. Please provide a valid token."
                            });
                        },
                        OnForbidden = async context =>
                        {
                            context.Response.StatusCode = StatusCodes.Status403Forbidden;
                            context.Response.ContentType = "application/json";

                            await context.Response.WriteAsJsonAsync(new
                            {
                                error = "Forbidden",
                                message = "You do not have permission to access this resource."
                            });
                        }
                    };
                });

            this._services.AddAuthorization(options =>
            {
                options.AddPolicy("RequireAuthenticatedUser", policy =>
                {
                    policy.RequireAuthenticatedUser();
                });

                // Optional: Add role-based policies
                options.AddPolicy("Admin", policy =>
                    policy.RequireRole("Admin"));
                options.AddPolicy("User", policy =>
                    policy.RequireRole("User", "Admin"));
            });

            // Register JWT service
            this._services.AddScoped<IJwtService, JwtService>();

            this._services.AddMvc();
        }
    }
}
