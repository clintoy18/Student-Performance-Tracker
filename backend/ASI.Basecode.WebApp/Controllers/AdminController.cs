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
    [Route(AppConstants.Controllers.Admin)]
    public class AdminController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly ICourseService _courseService;
        private readonly IJwtService _jwtService;
        private readonly ILogger<AdminController> _logger;

        public AdminController(
            IJwtService jwtService,
            IUserService userService,
            ICourseService courseService,
            ILogger<AdminController> logger)
        {
            _jwtService = jwtService;
            _userService = userService;
            _courseService = courseService;
            _logger = logger;
        }

        /// <summary>
        /// Creates a new user account with admin privileges
        /// </summary>
        /// <param name="request">User registration data including credentials and role</param>
        /// <returns>Success message or error details</returns>
        /// <response code="200">User created successfully</response>
        /// <response code="400">Invalid request data or user already exists</response>
        /// <response code="500">Internal server error</response>
        [HttpPost("user/create/")]
        [Authorize(Roles = "Admin")]
        public IActionResult CreateUser([FromBody] RegisterUserAdminModel request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new { message = "Invalid request format.", errors = ModelState.Values.SelectMany(v => v.Errors) });
            }

            try
            {
                var userViewModel = new RegisterUserAdminModel
                {
                    UserId = request.UserId,
                    FirstName = request.FirstName,
                    MiddleName = request.MiddleName,
                    LastName = request.LastName,
                    Password = request.Password,
                    Program = request.Program,
                    Role = request.Role
                };

                _userService.RegisterUserAdmin(userViewModel);

                return Ok(new { message = "User registered successfully." });
            }
            catch (InvalidDataException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Internal server error occurred while creating user.");
                return StatusCode(500, new { message = "An internal server error has occurred." });
            }
        }

        /// <summary>
        /// Updates an existing user's information
        /// </summary>
        /// <param name="userId">The ID of the user to update</param>
        /// <param name="request">Updated user data (password optional)</param>
        /// <returns>Success message or error details</returns>
        /// <response code="200">User updated successfully</response>
        /// <response code="400">Invalid request data or ID mismatch</response>
        /// <response code="404">User not found</response>
        /// <response code="500">Internal server error</response>
        [HttpPut("user/update/{userId}")]
        [Authorize(Roles = "Admin")]
        public IActionResult UpdateUser(string userId, [FromBody] RegisterUserAdminModel request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new { message = "Invalid request format.", errors = ModelState.Values.SelectMany(v => v.Errors) });
            }

            if (userId != request.UserId)
            {
                return BadRequest(new { message = "User ID in route does not match User ID in request body." });
            }

            try
            {
                var userViewModel = new RegisterUserAdminModel
                {
                    UserId = request.UserId,
                    FirstName = request.FirstName,
                    MiddleName = request.MiddleName,
                    LastName = request.LastName,
                    Password = request.Password, // Can be null/empty to preserve current password
                    Program = request.Program,
                    Role = request.Role
                };

                _userService.UpdateUserAdmin(userViewModel);

                return Ok(new { message = "User updated successfully." });
            }
            catch (InvalidDataException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An internal server error has occurred: ");
                return StatusCode(500, new { message = "An internal server error has occurred.", error = ex.Message });
            }
        }

        /// <summary>
        /// Deletes a user account
        /// </summary>
        /// <param name="userId">The ID of the user to delete</param>
        /// <returns>Success message or error details</returns>
        /// <response code="200">User deleted successfully</response>
        /// <response code="400">Invalid user ID</response>
        /// <response code="404">User not found</response>
        /// <response code="500">Internal server error</response>
        [HttpDelete("user/delete/{userId}")]
        [Authorize(Roles = "Admin")]
        public IActionResult DeleteUser(string userId)
        {
            if (string.IsNullOrWhiteSpace(userId))
            {
                return BadRequest(new { message = "User ID is required." });
            }

            try
            {
                _userService.DeleteUser(userId);

                return Ok(new { message = "User deleted successfully." });
            }
            catch (InvalidDataException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An internal server error has occurred: ");
                return StatusCode(500, new { message = "An internal server error has occurred.", error = ex.Message });
            }
        }

        /// <summary>
        /// Retrieves a specific user's information
        /// </summary>
        /// <param name="userId">The ID of the user to retrieve</param>
        /// <returns>User data without password information</returns>
        /// <response code="200">User data retrieved successfully</response>
        /// <response code="400">Invalid user ID</response>
        /// <response code="404">User not found</response>
        /// <response code="500">Internal server error</response>
        [HttpGet("user/{userId}")]
        [Authorize(Roles = "Admin")]
        public IActionResult GetUser(string userId)
        {
            if (string.IsNullOrWhiteSpace(userId))
            {
                return BadRequest(new { message = "User ID is required." });
            }

            try
            {
                var user = _userService.FetchUser(userId);

                if (user == null)
                {
                    return NotFound(new { message = "User not found." });
                }

                var userModel = new UserViewAdminModel
                {
                    UserId = user.UserId,
                    FirstName = user.FirstName,
                    MiddleName = user.MiddleName,
                    LastName = user.LastName,
                    Program = user.Program,
                    Role = user.Role
                    // Note: Password fields are not returned for security
                };

                return Ok(userModel);
            }
            catch (InvalidDataException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An internal server error has occurred: ");
                return StatusCode(500, new { message = "An internal server error has occurred.", error = ex.Message });
            }
        }


        /// <summary>
        /// Retrieves all users
        /// </summary>
        /// <returns>All user data</returns>
        /// <response code="200">Users retrieved successfully</response>
        /// <response code="500">Internal server error</response>
        [HttpGet("user")]
        [Authorize(Roles = "Admin")]
        public IActionResult GetAllUsers()
        {
            try
            {
                var users = _userService.GetAllUsers();
                return Ok(users);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An internal server error has occurred: ");
                return StatusCode(500, new { message = "An internal server error has occurred.", error = ex.Message });
            }
        }

        /// <summary>
        /// Retrieves the most recently registered users
        /// </summary>
        /// <param name="count">Number of recent users to retrieve (default: 5)</param>
        /// <returns>List of recently registered users without password information</returns>
        /// <response code="200">Recent users retrieved successfully</response>
        /// <response code="500">Internal server error</response>
        [HttpGet("user/recent")]
        [Authorize(Roles = "Admin")]
        public IActionResult GetRecentUsers([FromQuery] int count = 5)
        {
            try
            {
                var users = _userService.GetRecentUsers(count);
                return Ok(users);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An internal server error has occurred: ");
                return StatusCode(500, new { message = "An internal server error has occurred.", error = ex.Message });
            }
        }

        /// <summary>
        /// Retrieves dashboard statistics including user counts by role and total courses
        /// </summary>
        /// <returns>Dashboard statistics including user and course counts</returns>
        /// <response code="200">Dashboard statistics retrieved successfully</response>
        /// <response code="500">Internal server error</response>
        [HttpGet("dashboard-stats")]
        [Authorize(Roles = "Admin")]
        public IActionResult GetDashboardStats()
        {
            try
            {
                var userStats = _userService.GetUserStatistics();
                var courseCount = _courseService.GetCourseCount();

                var dashboardStats = new DashboardStatsViewModel
                {
                    UserStats = userStats,
                    TotalCourses = courseCount
                };

                return Ok(dashboardStats);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An internal server error has occurred: ");
                return StatusCode(500, new { message = "An internal server error has occurred.", error = ex.Message });
            }
        }
    }

}