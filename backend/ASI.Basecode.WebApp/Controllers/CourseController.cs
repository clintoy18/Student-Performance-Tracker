using ASI.Basecode.Data.Models;
using ASI.Basecode.Services.Interfaces;
using ASI.Basecode.Services.ServiceModels;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.IO;
using System.Linq;
using System.Security.Claims;
using ASI.Basecode.Resources.Constants;
using Microsoft.AspNetCore.Authorization;
using static ASI.Basecode.Resources.Constants.Enums;
using Microsoft.AspNetCore.Http;
using System.Collections.Generic;

namespace ASI.Basecode.WebApp.Controllers
{
    [ApiController]
    [Route(AppConstants.Controllers.Course)]
    public class CourseController : ControllerBase
    {
        private readonly ICourseService _courseService;
        private readonly ILogger<CourseController> _logger;
        private readonly IRbacService _rbacService;
        private readonly IUserService _userService;

        public CourseController(
            ICourseService courseService,
            IRbacService rbacService,
            IUserService userService,
            ILogger<CourseController> logger)
        {
            _courseService = courseService;
            _rbacService = rbacService;
            _userService = userService;
            _logger = logger;
        }

        /// <summary>
        /// Retrieves all courses
        /// </summary>
        /// <remarks>
        /// **Authorization:** Admin
        /// </remarks>
        /// <returns>List of courses</returns>
        /// <response code="200">Courses retrieved successfully</response>
        /// <response code="500">Internal server error</response>
        [HttpGet("list")]
        [Authorize(Roles = "Admin")]
        [ProducesResponseType(typeof(IEnumerable<CourseListViewModel>), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public IActionResult GetAllCourses()
        {
            try
            {
                var courses = _courseService.GetAllCourses();

                var coursesDto = courses.Select(c =>
                {
                    var teacher = _userService.FetchUser(c.UserId);
                    return new CourseListViewModel
                    {
                        Id = c.Id,
                        CourseCode = c.CourseCode,
                        CourseName = c.CourseName,
                        CourseDescription = c.CourseDescription,
                        AssignedTeacher = teacher,
                        CreatedAt = c.CreatedAt
                    };
                }).ToList();

                return Ok(coursesDto);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error while fetching courses.");
                return StatusCode(500, new { message = "An internal server error occurred." });
            }
        }

        /// <summary>
        /// Retrieves a specific course by ID
        /// </summary>
        /// <remarks>
        /// **Authorization:** Admin
        /// </remarks>
        /// <param name="courseId">Course ID</param>
        /// <returns>Course details</returns>
        /// <response code="200">Course retrieved successfully</response>
        /// <response code="400">Invalid course ID</response>
        /// <response code="404">Course not found</response>
        /// <response code="500">Internal server error</response>
        [HttpGet("{courseId:int}")]
        [Authorize(Roles = "Admin")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public IActionResult GetCourse(int courseId)
        {
            if (courseId <= 0)
                return BadRequest(new { message = "Course ID is required." });

            try
            {
                var course = _courseService.FetchCourse(courseId);

                if (course == null)
                    return NotFound(new { message = "Course not found." });

                return Ok(new
                {
                    course.Id,
                    course.CourseCode,
                    course.CourseName,
                    course.CourseDescription,
                    course.UserId,
                    course.CreatedAt

                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error while retrieving course.");
                return StatusCode(500, new { message = "An internal server error occurred." });
            }
        }

        /// <summary>
        /// Retrieves a specific course by course code
        /// </summary>
        /// <remarks>
        /// **Authorization:** Admin
        /// </remarks>
        /// <param name="courseCode">Course code</param>
        /// <returns>Course details</returns>
        /// <response code="200">Course retrieved successfully</response>
        /// <response code="400">Invalid course code</response>
        /// <response code="404">Course not found</response>
        /// <response code="500">Internal server error</response>
        [HttpGet("code/{courseCode}")]
        [Authorize(Roles = "Admin")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public IActionResult GetCourseByCourseCode(string courseCode)
        {
            if (string.IsNullOrWhiteSpace(courseCode))
                return BadRequest(new { message = "Course code is required." });

            try
            {
                var course = _courseService.FetchCourseByCourseCode(courseCode);

                if (course == null)
                    return NotFound(new { message = "Course not found." });

                return Ok(new
                {
                    course.Id,
                    course.CourseCode,
                    course.CourseName,
                    course.CourseDescription,
                    course.UserId,
                    course.CreatedAt
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error while retrieving course by course code.");
                return StatusCode(500, new { message = "An internal server error occurred." });
            }
        }

        /// <summary>
        /// Adds a new course
        /// </summary>
        /// <remarks>
        /// **Authorization:** Admin
        /// </remarks>
        /// <param name="model">Course data</param>
        /// <returns>Success message</returns>
        /// <response code="200">Course added successfully</response>
        /// <response code="400">Invalid request data</response>
        /// <response code="401">Unauthorized</response>
        /// <response code="500">Internal server error</response>
        [HttpPost("add")]
        [Authorize(Roles = "Admin")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public IActionResult AddCourse([FromBody] CourseViewModel model)
        {
            if (!ModelState.IsValid)
                return BadRequest(new { message = "Invalid request format.", errors = ModelState.Values.SelectMany(v => v.Errors) });

            try
            {
                _courseService.RegisterCourse(model);
                return Ok(new { message = "Course added successfully." });
            }
            catch (InvalidDataException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error while adding course.");
                return StatusCode(500, new { message = "An internal server error occurred." });
            }
        }

        /// <summary>
        /// Updates a course
        /// </summary>
        /// <remarks>
        /// **Authorization:** Admin
        /// </remarks>
        /// <param name="model">Updated course data</param>
        /// <returns>Success message</returns>
        /// <response code="200">Course updated successfully</response>
        /// <response code="400">Invalid request data</response>
        /// <response code="401">Unauthorized</response>
        /// <response code="403">Forbidden - teacher doesn't own this course</response>
        /// <response code="404">Course not found</response>
        /// <response code="500">Internal server error</response>
        [HttpPut("update")]
        [Authorize(Roles = "Admin")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public IActionResult UpdateCourse([FromBody] CourseUpdateViewModel model)
        {
            if (!ModelState.IsValid)
                return BadRequest(new { message = "Invalid request format.", errors = ModelState.Values.SelectMany(v => v.Errors) });

            try
            {
                // Get current user and validate ownership
                var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(currentUserId))
                {
                    return Unauthorized(new { message = "Authentication required." });
                }

                var currentUserRole = _rbacService.GetUserRole(currentUserId);

                // If teacher, verify they own this course
                if (currentUserRole == UserRoles.Teacher)
                {
                    var existingCourse = _courseService.FetchCourse(model.Id);
                    if (existingCourse == null)
                        return NotFound(new { message = "Course not found." });

                    if (existingCourse.UserId != currentUserId)
                    {
                        return StatusCode(403, new { message = "You do not have permission to update this course." });
                    }
                }

                _courseService.UpdateCourse(model);
                return Ok(new { message = "Course updated successfully." });
            }
            catch (InvalidDataException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error while updating course.");
                return StatusCode(500, new { message = "An internal server error occurred.", error = ex.Message });
            }
        }

        /// <summary>
        /// Deletes a course by ID
        /// </summary>
        /// <remarks>
        /// **Authorization:** Admin
        /// </remarks>
        /// <param name="courseId">Course ID to delete</param>
        /// <returns>Success message</returns>
        /// <response code="200">Course deleted successfully</response>
        /// <response code="400">Invalid course ID</response>
        /// <response code="401">Unauthorized</response>
        /// <response code="403">Forbidden - teacher doesn't own this course</response>
        /// <response code="404">Course not found</response>
        /// <response code="500">Internal server error</response>
        [HttpDelete("delete/{courseId:int}")]
        [Authorize(Roles = "Admin")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public IActionResult DeleteCourse(int courseId)
        {
            if (courseId <= 0)
                return BadRequest(new { message = "Course ID is required." });

            try
            {
                // Validate ownership for teachers
                var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(currentUserId))
                {
                    return Unauthorized(new { message = "Authentication required." });
                }

                var currentUserRole = _rbacService.GetUserRole(currentUserId);

                var course = _courseService.FetchCourse(courseId);
                if (course == null)
                    return NotFound(new { message = "Course not found." });

                // If teacher, verify ownership
                if (currentUserRole == UserRoles.Teacher && course.UserId != currentUserId)
                {
                    return StatusCode(403, new { message = "You do not have permission to delete this course." });
                }

                _courseService.DeleteCourse(courseId);
                return Ok(new { message = "Course deleted successfully." });
            }
            catch (InvalidDataException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error while deleting course.");
                return StatusCode(500, new { message = "An internal server error occurred." });
            }
        }

        /// <summary>
        /// Deletes a course by course code
        /// </summary>
        /// <remarks>
        /// **Authorization:** Admin
        /// </remarks>
        /// <param name="courseCode">Course code to delete</param>
        /// <returns>Success message</returns>
        /// <response code="200">Course deleted successfully</response>
        /// <response code="400">Invalid course code</response>
        /// <response code="401">Unauthorized</response>
        /// <response code="403">Forbidden - teacher doesn't own this course</response>
        /// <response code="404">Course not found</response>
        /// <response code="500">Internal server error</response>
        [HttpDelete("delete/code/{courseCode}")]
        [Authorize(Roles = "Admin")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public IActionResult DeleteCourseByCourseCode(string courseCode)
        {
            if (string.IsNullOrWhiteSpace(courseCode))
                return BadRequest(new { message = "Course code is required." });

            try
            {
                // Validate ownership for teachers
                var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(currentUserId))
                {
                    return Unauthorized(new { message = "Authentication required." });
                }

                var currentUserRole = _rbacService.GetUserRole(currentUserId);

                var course = _courseService.FetchCourseByCourseCode(courseCode);
                if (course == null)
                    return NotFound(new { message = "Course not found." });

                // If teacher, verify ownership
                if (currentUserRole == UserRoles.Teacher && course.UserId != currentUserId)
                {
                    return StatusCode(403, new { message = "You do not have permission to delete this course." });
                }

                _courseService.DeleteCourseByCourseCode(courseCode);
                return Ok(new { message = "Course deleted successfully." });
            }
            catch (InvalidDataException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error while deleting course by course code.");
                return StatusCode(500, new { message = "An internal server error occurred." });
            }
        }
    }
}