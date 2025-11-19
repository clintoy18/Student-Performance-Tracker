using ASI.Basecode.Data.Models;
using ASI.Basecode.Resources.Constants;
using ASI.Basecode.Services;
using ASI.Basecode.Services.Interfaces;
using ASI.Basecode.Services.ServiceModels;
using ASI.Basecode.Services.Services;
using ASI.Basecode.WebApp.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using static ASI.Basecode.Resources.Constants.Enums;
using Microsoft.AspNetCore.Http;
using AutoMapper;

namespace ASI.Basecode.WebApp.Controllers
{
    [ApiController]
    [Route(AppConstants.Controllers.Admin)]
    public class AdminController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly ICourseService _courseService;
        private readonly IJwtService _jwtService;
        private readonly IStudentCourseService _studentCourseService;
        private readonly IPdfService _pdfService;
        private readonly ILogger<AdminController> _logger;
        private readonly IMapper _mapper;
        public AdminController(
            IJwtService jwtService,
            IUserService userService,
            ICourseService courseService,
            IPdfService pdfService,
            IStudentCourseService studentCourseService,
            ILogger<AdminController> logger,
            IMapper mapper
        )
        {
            _jwtService = jwtService;
            _userService = userService;
            _studentCourseService = studentCourseService;
            _courseService = courseService;
            _pdfService = pdfService;
            _logger = logger;
            _mapper = mapper;
        }

        /// <summary>
        /// Creates a new user account with admin privileges
        /// </summary>
        /// <remarks>
        /// **Authorization:** Admin
        /// </remarks>
        /// <param name="request">User registration data including credentials and role</param>
        /// <returns>Success message or error details</returns>
        /// <response code="200">User created successfully</response>
        /// <response code="400">Invalid request data or user already exists</response>
        /// <response code="500">Internal server error</response>
        [HttpPost("user/create/")]
        [Authorize(Roles = "Admin")]
        [ProducesResponseType(typeof(UserViewAdminModel), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public IActionResult CreateUser([FromBody] RegisterUserViewModel request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new
                {
                    message = "Invalid request format.",
                    errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage)
                });
            }

            try
            {
                // Call the service — this returns the generated UserId
                string generatedUserId = _userService.RegisterUser(request);

                // Return the generated ID in the response
                return Ok(new RegisterControllerViewModel
                {
                    userId = generatedUserId,      
                    message = "User created successfully."
                });
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
        /// Updates an existing user's information
        /// </summary>
        /// <remarks>
        /// **Authorization:** Admin
        /// </remarks>
        /// <param name="userId">The ID of the user to update</param>
        /// <param name="request">Updated user data (password optional)</param>
        /// <returns>Success message or error details</returns>
        /// <response code="200">User updated successfully</response>
        /// <response code="400">Invalid request data or ID mismatch</response>
        /// <response code="404">User not found</response>
        /// <response code="500">Internal server error</response>
        [HttpPut("user/update/{userId}")]
        [Authorize(Roles = "Admin")]
        [ProducesResponseType(typeof(RegisterUserAdminModel), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
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
                var updatedUser = _mapper.Map<RegisterUserAdminModel>(request);

                _userService.UpdateUserAdmin(updatedUser);

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
        /// <remarks>
        /// **Authorization:** Admin
        /// </remarks>
        /// <param name="userId">The ID of the user to delete</param>
        /// <returns>Success message or error details</returns>
        /// <response code="200">User deleted successfully</response>
        /// <response code="400">Invalid user ID</response>
        /// <response code="404">User not found</response>
        /// <response code="500">Internal server error</response>
        [HttpDelete("user/delete/{userId}")]
        [Authorize(Roles = "Admin")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
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
        /// <remarks>
        /// **Authorization:** Admin
        /// </remarks>
        /// <param name="userId">The ID of the user to retrieve</param>
        /// <returns>User data without password information</returns>
        /// <response code="200">User data retrieved successfully</response>
        /// <response code="400">Invalid user ID</response>
        /// <response code="404">User not found</response>
        /// <response code="500">Internal server error</response>
        [HttpGet("user/{userId}")]
        [Authorize(Roles = "Admin")]
        [ProducesResponseType(typeof(UserViewAdminModel), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public IActionResult GetUser(string userId)
        {
            if (string.IsNullOrWhiteSpace(userId))
            {
                return BadRequest(new { message = "User ID is required." });
            }

            try
            {
                var user = _mapper.Map<UserViewAdminModel>(_userService.FetchUser(userId));

                if (user == null)
                {
                    return NotFound(new { message = "User not found." });
                }

                return Ok(user);
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
        /// Retrieves all users with respective roles
        /// </summary>
        /// <remarks>
        /// **Authorization:** Admin
        /// </remarks>
        /// <returns>All user  with respective roles</returns>
        /// <response code="200">Users retrieved successfully</response>
        /// <response code="500">Internal server error</response>

        [HttpGet("getUsersByRole")]
        [AllowAnonymous]
        [ProducesResponseType(typeof(IEnumerable<UserViewAdminModel>), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public IActionResult GetUsersByRole(UserRoles role)
        {
            try
            {
                var users = _userService.GetUsersByRole(role);
                return Ok(users);
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
        /// <remarks>
        /// **Authorization:** Admin
        /// </remarks>
        /// <returns>All user data</returns>
        /// <response code="200">Users retrieved successfully</response>
        /// <response code="500">Internal server error</response>
        [HttpGet("user")]
        //[Authorize(Roles = "Admin")]
        [AllowAnonymous]
        [ProducesResponseType(typeof(IEnumerable<UserViewAdminModel>), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
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
        /// <remarks>
        /// **Authorization:** Admin
        /// </remarks>
        /// <param name="count">Number of recent users to retrieve (default: 5)</param>
        /// <returns>List of recently registered users without password information</returns>
        /// <response code="200">Recent users retrieved successfully</response>
        /// <response code="500">Internal server error</response>
        [HttpGet("user/recent")]
        [Authorize(Roles = "Admin")]
        [ProducesResponseType(typeof(IEnumerable<UserViewAdminModel>), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public IActionResult GetRecentUsers([FromQuery] int count = 5)
        {
            try
            {
                var users = _userService.GetRecentUsers(count);

                if (users == null || !users.Any())
                    return NotFound(new { message = "No users found." });

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
        /// <remarks>
        /// **Authorization:** Admin
        /// </remarks>
        /// <returns>Dashboard statistics including user and course counts</returns>
        /// <response code="200">Dashboard statistics retrieved successfully</response>
        /// <response code="500">Internal server error</response>
        [HttpGet("dashboard-stats")]
        [Authorize(Roles = "Admin")]
        [ProducesResponseType(typeof(DashboardStatsViewModel), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public IActionResult wGetDashboardStats()
        {
            try
            {
                var userStats = _userService.GetUserStatistics();
                var courseCount = _courseService.GetCourseCount();

                // Dili ma automap :/
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

        /// <summary>
        /// Assigns a teacher to a course
        /// </summary>
        /// <remarks>
        /// **Authorization:** Admin
        /// </remarks>
        /// <param name="courseId">The ID of the course</param>
        /// <param name="teacherId">The user ID of the teacher</param>
        /// <returns>Success or error</returns>
        [HttpPut("course/assign-teacher/{courseId}")]
        [Authorize(Roles = "Admin")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public IActionResult AssignTeacherToCourse(int courseId, [FromQuery] string teacherId)
        {
            if (string.IsNullOrWhiteSpace(teacherId))
                return BadRequest(new { message = "Teacher ID is required." });

            try
            {
                // Fetch teacher and validate role
                var teacher = _userService.FetchUser(teacherId);
                if (teacher == null || teacher.Role != Enums.UserRoles.Teacher)
                {
                    return BadRequest(new { message = "Invalid teacher ID or user is not a teacher." });
                }

                // Assign teacher
                _courseService.AssignTeacher(courseId, teacherId);

                return Ok(new { message = "Teacher assigned successfully." });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error assigning teacher to course.");
                return StatusCode(500, new { message = "An internal server error occurred.", error = ex.Message });
            }
        }

        //Generate pdf for dashboard summary frontend buttons is missing please provide for it
        //(choose :
        //1.all users : null
        //2.students = students
        //3.teachers = teachers
        //4.admin = admin)
        [HttpGet("pdf/dashboard-summary")]
        [Authorize(Roles = "Admin")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public IActionResult GenerateDashboardSummaryPdf(string? role = null)
        {
            try
            {
                var userStats = _userService.GetUserStatistics();
                var courseCount = _courseService.GetCourseCount();


                UserRoles? parsedRole = null;

                // Fetch filtered or all users
                List<UserViewAdminModel> userLists;

                if (!string.IsNullOrWhiteSpace(role))
                {
                    if (Enum.TryParse<UserRoles>(role.Trim(), true, out var tempRole))
                    {
                        parsedRole = tempRole;
                        userLists = _userService.GetUsersByRole(parsedRole.Value)
                            .Select(u => new UserViewAdminModel
                            {
                                UserId = u.UserId,
                                FirstName = u.FirstName,
                                LastName = u.LastName,
                                Program = u.Program,
                                Role = u.Role
                            })
                            .ToList();
                    }
                    else
                    {
                        return BadRequest(new { message = "Invalid role. Use Student, Teacher, or Admin." });
                    }
                }
                else
                {
                    userLists = _userService.GetAllUsers()
                        .Select(u => new UserViewAdminModel
                        {
                            UserId = u.UserId,
                            FirstName = u.FirstName,
                            LastName = u.LastName,
                            Program = u.Program,
                            Role = u.Role
                        })
                        .ToList();
                }

                var dashboardStats = new DashboardStatsViewModel
                {
                    UserStats = userStats,
                    TotalCourses = courseCount
                    
                };

                var courses = _courseService.GetAllCourses()
                    .Select(c => new CourseViewModel
                    {
                        Id = c.Id,
                        CourseCode = c.CourseCode,
                        CourseName = c.CourseName,
                        CourseDescription = c.CourseDescription
                    })
                    .ToList();

                var pdfBytes = _pdfService.GenerateDashboardSummaryReport(
                    dashboardStats,
                    userLists,
                    courses,
                    parsedRole
                );

                string fileName = string.IsNullOrWhiteSpace(role)
                    ? "dashboard_summary_report.pdf"
                    : $"dashboard_summary_{role.Trim().ToLower()}_report.pdf";

                return File(pdfBytes, "application/pdf", fileName);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error generating dashboard summary PDF");
                return StatusCode(500, new
                {
                    message = "Error generating dashboard summary PDF",
                    error = ex.Message
                });
            }
        }

        // GET: api/admin/pdf/grades-per-course
        [HttpGet("pdf/course-grade-summary")]
        [Authorize(Roles = "Admin")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public IActionResult GetGradesPerCoursePdf()
        {
            try
            {
                // Fetch grades using the service
                var grades = _studentCourseService.GetGradesPerCourse();

                // Generate PDF using pdfService
                var pdfBytes = _pdfService.GenerateCourseGradeSummary(grades);

                // Return and download file
                return File(pdfBytes, "application/pdf", "CourseGradeSummary.pdf");
            }
            catch (Exception ex)
            {
                // Optional: log the exception
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    }

}