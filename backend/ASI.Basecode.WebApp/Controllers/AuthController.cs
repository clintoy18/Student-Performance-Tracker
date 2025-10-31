using ASI.Basecode.Services.Interfaces;
using ASI.Basecode.Services.ServiceModels;
using ASI.Basecode.WebApp.Models;
using ASI.Basecode.Services;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Collections.Generic;
using ASI.Basecode.Data.Models;
using Microsoft.Extensions.Options;
using ASI.Basecode.Resources.Constants;
using System.IO;
using System.Linq;
using System;
using static ASI.Basecode.Resources.Constants.Enums;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Authorization;

namespace ASI.Basecode.WebApp.Controllers
{
    [ApiController]
    [Route(AppConstants.Controllers.Authentication)]
    public class AuthController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly IJwtService _jwtService;
        private readonly ILogger<AuthController> _logger;
        private readonly IRbacService _rbacService;
        public AuthController(
            IJwtService jwtService,
            IUserService userService,
            ILogger<AuthController> logger,
            IRbacService rbacService
        )
        {
            _jwtService = jwtService;
            _userService = userService;
            _logger = logger;
            _rbacService = rbacService;
        }

        /// <summary>
        /// Authenticates a user and returns a JWT access token.
        /// </summary>
        /// <param name="request">The login credentials containing UserId and Password.</param>
        /// <returns>
        /// Returns a 200 OK with a JWT token and user info if credentials are valid.
        /// Returns 400 Bad Request if the request is malformed.
        /// Returns 401 Unauthorized if credentials are invalid.
        /// </returns>
        /// <response code="200">Login successful. Returns token and user details.</response>
        /// <response code="400">Invalid request format or missing fields.</response>
        /// <response code="401">Invalid UserId or password.</response>
        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (request == null)
            {
                return BadRequest(new { message = "Request is null" });
            }

            var loginResult = _userService.AuthenticateUser(request.UserId, request.Password);

            if (loginResult == LoginResult.Success)
            {
                var user = _userService.FetchUser(request.UserId);

                if (user == null)
                {
                    return Unauthorized(new { message = "User not found" });
                }

                var token = _jwtService.GenerateToken(user.UserId, user.Role);

                return Ok(new LoginResponse
                {
                    Message = "Login successful",
                    Token = token,
                    User = new UserDto
                    {
                        UserId = user.UserId,
                        LastName = user.LastName,
                        Role = user.Role.ToString()
                    }
                });
            }
            else
            {
                return Unauthorized(new { message = "Invalid user ID or password." });
            }
        }

        /// <summary>
        /// Registers a new user in the system.
        /// </summary>
        /// <returns>
        /// Returns 200 OK if user is registered successfully.
        /// Returns 400 Bad Request if UserId already exists or model validation fails.
        /// Returns 500 Internal Server Error for unexpected failures.
        /// </returns>
        /// <response code="200">User registered successfully.</response>
        /// <response code="400">UserId already exists or invalid input data.</response>
        /// <response code="500">Internal server error during registration.</response>
        [HttpPost("register")]
        public IActionResult Register([FromBody] RegisterUserViewModel request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new { message = "Invalid request format.", errors = ModelState.Values.SelectMany(v => v.Errors) });
            }

            try
            {
                var userViewModel = new RegisterUserViewModel
                {
                    UserId = request.UserId,
                    FirstName = request.FirstName,
                    MiddleName = request.MiddleName,
                    LastName = request.LastName,
                    Password = request.Password,
                    Program = request.Program
                    // Add Role if needed, e.g., Role = UserRoles.User
                };

                _userService.RegisterUser(userViewModel);

                return Ok(new { message = "User registered successfully." });
            }
            catch (InvalidDataException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch
            {
                return StatusCode(500, new { message = "An internal server error has occurred." });
            }
        }

        /// <summary>
        /// Retrieves the profile of the currently authenticated user based on the provided JWT token.
        /// </summary>
        /// <remarks>
        /// **Authorization:** Authenticated
        /// </remarks>
        /// <returns>
        /// Returns 200 OK with user details (UserId, FirstName, LastName, Role) if token is valid.
        /// Returns 401 Unauthorized if token is missing, invalid, expired, or user not found.
        /// </returns>
        /// <response code="200">User profile retrieved successfully.</response>
        /// <response code="401">Missing, invalid, or expired token; or user not found.</response>
        [Authorize]
        [HttpGet("me")]
        public IActionResult GetCurrentUser()
        {
            // Get token from Authorization header: "Bearer <token>"
            var authHeader = Request.Headers["Authorization"].FirstOrDefault();

            if (string.IsNullOrEmpty(authHeader) || !authHeader.StartsWith("Bearer "))
            {
                return Unauthorized(new { message = "Missing or invalid authorization header." });
            }

            var token = authHeader["Bearer ".Length..].Trim();

            // Validate token
            var claimsPrincipal = _jwtService.ValidateToken(token);
            if (claimsPrincipal == null)
            {
                return Unauthorized(new { message = "Invalid or expired token." });
            }

            var userId = claimsPrincipal.FindFirst(ClaimTypes.NameIdentifier)?.Value; // exxtract userId from claims principal
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized(new { message = "Token missing user identifier." });
            }

            // Optional: Fetch full user from DB (if needed)
            var user = _userService.FetchUser(userId);
            if (user == null)
            {
                return Unauthorized(new { message = "User not found." });
            }

            // Return user info (safe subset)
            return Ok(new
            {
                user.UserId,
                user.FirstName,
                user.MiddleName,
                user.LastName,
                user.Program,
                Role = user.Role.ToString()
            });
        }

        /// <summary>
        /// Updates the current authenticated user's profile.
        /// Frontend must NOT send UserId — it's inferred from the token.
        /// </summary>
        /// <remarks>
        /// **Authorization:** Authenticated
        /// </remarks>
        [Authorize]
        [HttpPut("me/update")]
        public IActionResult UpdateCurrentUser([FromBody] UpdateMyProfileModel request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new { message = "Invalid input data.", errors = ModelState });
            }

            // === Extract current user ID from JWT token ===
            var authHeader = Request.Headers["Authorization"].FirstOrDefault();
            if (string.IsNullOrEmpty(authHeader) || !authHeader.StartsWith("Bearer "))
            {
                return Unauthorized(new { message = "Missing or invalid authorization header." });
            }

            var token = authHeader["Bearer ".Length..].Trim();
            var claimsPrincipal = _jwtService.ValidateToken(token);
            if (claimsPrincipal == null)
            {
                return Unauthorized(new { message = "Invalid or expired token." });
            }

            var userId = claimsPrincipal.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized(new { message = "User ID not found in token." });
            }

            var role = _rbacService.GetUserRole(userId);
            // ==============================================

            // === Build RegisterUserViewModel with authenticated UserId ===
            var updateModel = new RegisterUserAdminModel
            {
                UserId = userId, // 🔒 Enforced from token — frontend cannot override
                FirstName = request.FirstName,
                MiddleName = request.MiddleName,
                LastName = request.LastName,
                Program = request.Program,
                Password = request.Password, // optional; if null/empty, existing password is preserved
                Role = role
            };
            // ===========================================================

            try
            {
                _userService.UpdateUserAdmin(updateModel); // ✅ Reuses existing service method
                return Ok(new { message = "Profile updated successfully." });
            }
            catch (InvalidDataException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating user: ");
                return StatusCode(500, new { message = "An error occurred while updating your profile." });
            }
        }
    }
}