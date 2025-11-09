using ASI.Basecode.Services.Interfaces;
using ASI.Basecode.Services.ServiceModels;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using System.Collections.Generic;
using ASI.Basecode.Data.Models;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Authorization;
using System;
using static ASI.Basecode.Resources.Constants.Enums;
using ASI.Basecode.Resources.Constants;


using System.Linq;
using Microsoft.AspNetCore.Http;

namespace ASI.Basecode.WebApp.Controllers
{
    [ApiController]
    [Route(AppConstants.Controllers.GradeFeedback)]
    public class GradeFeedbackController : ControllerBase
    {
        private readonly IGradeFeedbackService _gradeFeedbackService;
        private readonly IUserService _userService;
        private readonly IRbacService _rbacService;
        private readonly ICourseService _courseService;
        private readonly ILogger<GradeFeedbackController> _logger;

        public GradeFeedbackController(
            IGradeFeedbackService gradeFeedbackService,
            IUserService userService,
            IRbacService rbacService,
            ICourseService courseService,
            ILogger<GradeFeedbackController> logger)
        {
            _gradeFeedbackService = gradeFeedbackService;
            _userService = userService;
            _rbacService = rbacService;
            _courseService = courseService;
            _logger = logger;
        }

        /// <summary>
        /// Creates grade feedback for a student course
        /// </summary>
        /// <remarks>
        /// **Authorization:** Teacher
        /// </remarks>
        /// <param name="request">Feedback creation data</param>
        /// <returns>Success message or error details</returns>
        /// <response code="200">Feedback created successfully</response>
        /// <response code="400">Invalid request data</response>
        /// <response code="401">Unauthorized - only teachers can create feedback</response>
        /// <response code="403">Forbidden - insufficient permissions</response>
        /// <response code="500">Internal server error</response>
        [HttpPost("create")]
        [Authorize(Roles = "Teacher")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public IActionResult CreateFeedback([FromBody] GradeFeedbackCreateRequestModel request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new { message = "Invalid request format.", errors = ModelState.Values.SelectMany(v => v.Errors) });
            }

            try
            {
                // Get current user from JWT token
                var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(currentUserId))
                {
                    return Unauthorized(new { message = "Authentication required." });
                }

                // Validate current user is Teacher
                var currentUserRole = _rbacService.GetUserRole(currentUserId);
                if (currentUserRole != UserRoles.Teacher)
                {
                    return Unauthorized(new { message = "Only teachers can create grade feedback." });
                }

                // Validate if StudentCourseId really is a student
                var studentRole = _rbacService.GetUserRole(request.CourseStudentUserId);
                if (studentRole != UserRoles.Student)
                {
                    return BadRequest(new { message = "Course student userId must be a userId of a student." });
                }

                // Validate if Course exists by courseCode
                var courseExists = _courseService.CourseExists(request.CourseCode);
                if (!courseExists)
                {
                    return BadRequest(new { message = "Coursecode does not link to any existing courses." });
                }

                var newFeedback = new GradeFeedbackCreateModel
                {
                    Feedback = request.Feedback,
                    TeacherUserId = currentUserId,
                    CourseStudentUserId = request.CourseStudentUserId,
                    CourseCode = request.CourseCode
                };

                _gradeFeedbackService.CreateGradeFeedback(newFeedback);

                return Ok(new { message = "Grade feedback created successfully." });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Internal server error occurred while creating grade feedback.");
                return StatusCode(500, new { message = "An internal server error has occurred." });
            }
        }

        /// <summary>
        /// Updates existing grade feedback
        /// </summary>
        /// <remarks>
        /// **Authorization:** Teacher
        /// </remarks>
        /// <param name="feedbackId">ID of the feedback to update</param>
        /// <param name="request">Updated feedback data</param>
        /// <returns>Success message or error details</returns>
        /// <response code="200">Feedback updated successfully</response>
        /// <response code="400">Invalid request data</response>
        /// <response code="401">Unauthorized - only teachers/admins can update feedback</response>
        /// <response code="403">Forbidden - teachers can only update their own feedback</response>
        /// <response code="404">Feedback not found</response>
        /// <response code="500">Internal server error</response>
        [HttpPut("update/{feedbackId}")]
        [Authorize(Roles = "Teacher")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public IActionResult UpdateFeedback(int feedbackId, [FromBody] GradeFeedbackUpdateRequestModel request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new { message = "Invalid request format.", errors = ModelState.Values.SelectMany(v => v.Errors) });
            }

            try
            {
                var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(currentUserId))
                {
                    return Unauthorized(new { message = "Authentication required." });
                }

                _gradeFeedbackService.UpdateGradeFeedback(feedbackId, request.Feedback);

                return Ok(new { message = "Grade feedback updated successfully." });
            }
            catch (ArgumentException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Internal server error occurred while updating grade feedback.");
                return StatusCode(500, new { message = "An internal server error has occurred." });
            }
        }

        /// <summary>
        /// Deletes grade feedback
        /// </summary>
        /// <remarks>
        /// **Authorization:** Teacher
        /// </remarks>
        /// <param name="feedbackId">ID of the feedback to delete</param>
        /// <returns>Success message or error details</returns>
        /// <response code="200">Feedback deleted successfully</response>
        /// <response code="401">Unauthorized - only teachers/admins can delete feedback</response>
        /// <response code="403">Forbidden - teachers can only delete their own feedback</response>
        /// <response code="404">Feedback not found</response>
        /// <response code="500">Internal server error</response>
        [HttpDelete("delete/{feedbackId}")]
        [Authorize(Roles = "Teacher")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public IActionResult DeleteFeedback(int feedbackId)
        {
            try
            {
                var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(currentUserId))
                {
                    return Unauthorized(new { message = "Authentication required." });
                }

                var currentUserRole = _rbacService.GetUserRole(currentUserId);
                var allowedRoles = new[] { UserRoles.Teacher, UserRoles.Admin };
                if (!allowedRoles.Contains(currentUserRole))
                {
                    return Unauthorized(new { message = "Only teachers and admins can delete grade feedback." });
                }

                // If user is Teacher (not Admin), verify they own the feedback
                if (currentUserRole == UserRoles.Teacher)
                {
                    var existingFeedback = _gradeFeedbackService.GetGradeFeedbackById(feedbackId);
                    if (existingFeedback.TeacherUserId != currentUserId)
                    {
                        return Unauthorized(new { message = "You can only delete your own feedback." });
                    }
                }

                _gradeFeedbackService.DeleteGradeFeedback(feedbackId);

                return Ok(new { message = "Grade feedback deleted successfully." });
            }
            catch (ArgumentException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Internal server error occurred while deleting grade feedback.");
                return StatusCode(500, new { message = "An internal server error has occurred." });
            }
        }

        /// <summary>
        /// Gets grade feedback for a specific student
        /// </summary>
        /// <remarks>
        /// **Authorization:** Student, Teacher
        /// </remarks>
        /// <param name="studentUserId">Student user ID</param>
        /// <param name="courseCode">Course code</param>
        /// <returns>Grade feedback details</returns>
        /// <response code="200">Feedback retrieved successfully</response>
        /// <response code="401">Unauthorized - only the student can view their own feedback</response>
        /// <response code="404">Feedback not found</response>
        /// <response code="500">Internal server error</response>
        [HttpGet("student/{studentUserId}/course/{courseCode}")]
        [Authorize(Roles = "Student,Teacher")]
        [ProducesResponseType(typeof(GradeFeedbackViewModel), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public IActionResult GetFeedbackForStudent(string studentUserId, string courseCode)
        {
            try
            {
                var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(currentUserId))
                {
                    return Unauthorized(new { message = "Authentication required." });
                }

                var feedback = _gradeFeedbackService.GetGradeFeedbackForStudent(studentUserId, courseCode);
                return Ok(feedback);
            }
            catch (ArgumentException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Internal server error occurred while retrieving grade feedback.");
                return StatusCode(500, new { message = "An internal server error has occurred." });
            }
        }

        /// <summary>
        /// Gets all grade feedback
        /// </summary>
        /// <remarks>
        /// **Authorization:** Admin
        /// </remarks>
        /// <returns>All grade feedback records</returns>
        /// <response code="200">Feedback retrieved successfully</response>
        /// <response code="401">Unauthorized - only teachers and admins can view all feedback</response>
        /// <response code="500">Internal server error</response>
        [HttpGet("all")]
        [Authorize(Roles = "Admin")]
        [ProducesResponseType(typeof(IEnumerable<GradeFeedbackViewModel>), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public IActionResult GetAllFeedback()
        {
            try
            {
                var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(currentUserId))
                {
                    return Unauthorized(new { message = "Authentication required." });
                }

                var currentUserRole = _rbacService.GetUserRole(currentUserId);
                var allowedRoles = new[] { UserRoles.Teacher, UserRoles.Admin };
                if (!allowedRoles.Contains(currentUserRole))
                {
                    return Unauthorized(new { message = "Only teachers and admins can view all feedback." });
                }

                var feedbacks = _gradeFeedbackService.GetAllGradeFeedbacks();
                return Ok(feedbacks);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Internal server error occurred while retrieving all grade feedback.");
                return StatusCode(500, new { message = "An internal server error has occurred." });
            }
        }

        /// <summary>
        /// Gets grade feedback by ID
        /// </summary>
        /// <remarks>
        /// **Authorization:** Teacher, Admin
        /// </remarks>
        /// <param name="feedbackId">Feedback ID</param>
        /// <returns>Grade feedback details</returns>
        /// <response code="200">Feedback retrieved successfully</response>
        /// <response code="401">Unauthorized - only teachers/admins or the student can view feedback</response>
        /// <response code="404">Feedback not found</response>
        /// <response code="500">Internal server error</response>
        [HttpGet("{feedbackId}")]
        [Authorize(Roles = "Teacher,Admin")]
        [ProducesResponseType(typeof(GradeFeedbackViewModel), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public IActionResult GetFeedbackById(int feedbackId)
        {
            try
            {
                var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(currentUserId))
                {
                    return Unauthorized(new { message = "Authentication required." });
                }

                var feedback = _gradeFeedbackService.GetGradeFeedbackById(feedbackId);

                return Ok(feedback);
            }
            catch (ArgumentException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Internal server error occurred while retrieving grade feedback by ID.");
                return StatusCode(500, new { message = "An internal server error has occurred." });
            }
        }

        /// <summary>
        /// Checks if grade feedback exists for a student in a course
        /// </summary>
        /// <remarks>
        /// **Authorization:** Teacher
        /// </remarks>
        /// <param name="studentUserId">Student user ID</param>
        /// <param name="courseCode">Course code</param>
        /// <returns>Boolean indicating if feedback exists</returns>
        /// <response code="200">Check completed successfully</response>
        /// <response code="401">Unauthorized</response>
        /// <response code="500">Internal server error</response>
        [HttpGet("exists/student/{studentUserId}/course/{courseCode}")]
        [Authorize(Roles = "Teacher")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public IActionResult CheckFeedbackExists(string studentUserId, string courseCode)
        {
            try
            {
                var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(currentUserId))
                {
                    return Unauthorized(new { message = "Authentication required." });
                }

                var exists = _gradeFeedbackService.CheckGradeFeedbackExists(studentUserId, courseCode);
                return Ok(new { exists });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Internal server error occurred while checking grade feedback existence.");
                return StatusCode(500, new { message = "An internal server error has occurred." });
            }
        }

        // Need to create route: Get Gradefeedback by coursecode (for teacher)
    }
}