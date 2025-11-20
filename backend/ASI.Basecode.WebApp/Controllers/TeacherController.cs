using ASI.Basecode.Services.Interfaces;
using ASI.Basecode.Services.ServiceModels;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Authorization;
using System;
using System.Linq;
using Microsoft.AspNetCore.Http;
using AutoMapper;
using ASI.Basecode.WebApp.Models;
using System.Collections.Generic;

namespace ASI.Basecode.WebApp.Controllers
{
    /// <summary>
    /// Controller for teacher-specific operations that aren't covered by other controllers
    /// </summary>
    [ApiController]
    [Route("api/teacher")]
    [Authorize(Roles = "Teacher")]
    public class TeacherController : ControllerBase
    {
        private readonly ICourseService _courseService;
        private readonly IStudentCourseService _studentCourseService;
        private readonly IGradeFeedbackService _gradeFeedbackService;
        private readonly ILogger<TeacherController> _logger;
        private readonly IMapper _mapper;

        public TeacherController(
            ICourseService courseService,
            IStudentCourseService studentCourseService,
            IGradeFeedbackService gradeFeedbackService,
            ILogger<TeacherController> logger,
            IMapper mapper
        )
        {
            _courseService = courseService;
            _studentCourseService = studentCourseService;
            _gradeFeedbackService = gradeFeedbackService;
            _logger = logger;
            _mapper = mapper;
        }

        // -------------------------------
        // Private helper methods
        // -------------------------------

        /// <summary>
        /// Gets the currently logged-in user's ID from claims
        /// </summary>
        private string GetCurrentUserId()
            => User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        /// <summary>
        /// Gets the number of students enrolled in a course
        /// </summary>
        private int GetStudentCount(string courseCode)
            => _studentCourseService.GetStudentCoursesOfCourse(courseCode).Count();

        // -------------------------------
        // Endpoints
        // -------------------------------

        /// <summary>
        /// Gets all courses assigned to the currently logged-in teacher
        /// </summary>
        /// <remarks>
        /// **Authorization:** Teacher
        /// </remarks>
        [HttpGet("my-courses")]
        [Authorize(Roles = "Teacher")]
        [ProducesResponseType(typeof(IEnumerable<MyCoursesViewModel>), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public IActionResult GetMyCourses()
        {
            try
            {
                var currentUserId = GetCurrentUserId();
                if (string.IsNullOrEmpty(currentUserId))
                    return Unauthorized(new { message = "Authentication required." });

                var courses = _courseService.FetchCoursesByUser(currentUserId)
                    .Select(c => new MyCoursesViewModel
                    {
                        id = c.Id,
                        courseCode = c.CourseCode,
                        courseName = c.CourseName,
                        courseDescription = c.CourseDescription,
                        createdAt = c.CreatedAt,
                        teacherUserId = c.UserId,
                        studentCount = GetStudentCount(c.CourseCode)
                    })
                    .ToList();

                return Ok(courses);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error while fetching teacher's courses.");
                return StatusCode(500, new { message = "An internal server error occurred." });
            }
        }

        /// <summary>
        /// Gets dashboard statistics for the teacher
        /// </summary>
        /// <remarks>
        /// **Authorization:** Teacher
        /// </remarks>
        [HttpGet("dashboard-stats")]
        [Authorize(Roles = "Teacher")]
        [ProducesResponseType(typeof(TeacherDashboardStatsModel), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public IActionResult GetDashboardStats()
        {
            try
            {
                var currentUserId = GetCurrentUserId();
                if (string.IsNullOrEmpty(currentUserId))
                    return Unauthorized(new { message = "Authentication required." });

                var myCourses = _courseService.FetchCoursesByUser(currentUserId);
                var courseCount = myCourses.Count();

                // Count total students across all teacher's courses
                var totalStudents = myCourses
                    .Select(c => GetStudentCount(c.CourseCode))
                    .Sum();

                var stats = new TeacherDashboardStatsModel
                {
                    totalCourses = courseCount,
                    totalStudents = totalStudents,
                    courses = myCourses.Select(c => new TeacherCourse
                    {
                        courseCode = c.CourseCode,
                        courseName = c.CourseName,
                        studentCount = GetStudentCount(c.CourseCode)
                    }).ToList()
                };

                return Ok(stats);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error while fetching teacher dashboard stats.");
                return StatusCode(500, new { message = "An internal server error occurred." });
            }
        }

        /// <summary>
        /// Gets all feedback given by this teacher
        /// </summary>
        /// <remarks>
        /// **Authorization:** Teacher
        /// </remarks>
        [HttpGet("my-feedback")]
        [Authorize(Roles = "Teacher")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public IActionResult GetMyFeedback()
        {
            try
            {
                var currentUserId = GetCurrentUserId();
                if (string.IsNullOrEmpty(currentUserId))
                    return Unauthorized(new { message = "Authentication required." });

                var allFeedback = _gradeFeedbackService.GetAllGradeFeedbacks();
                var myFeedback = allFeedback
                    .Where(f => f.TeacherUserId == currentUserId)
                    .ToList();

                return Ok(myFeedback);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error while fetching teacher's feedback.");
                return StatusCode(500, new { message = "An internal server error occurred." });
            }
        }
    }
}
