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
using System.Linq;
using ASI.Basecode.Resources.Constants;
using ASI.Basecode.Data.Interfaces;
using Microsoft.AspNetCore.Http;
using AutoMapper;
namespace ASI.Basecode.WebApp.Controllers
{
    [ApiController]
    [Route(AppConstants.Controllers.StudentCourse)]
    public class StudentCourseController : ControllerBase
    {
        private readonly IStudentCourseService _studentCourseService;
        private readonly IStudentCourseRepository _studentCourseRepository;
        private readonly IGradeFeedbackService _gradeFeedbackService;
        private readonly IUserService _userService;
        private readonly IRbacService _rbacService;
        private readonly ICourseService _courseService;
        private readonly ILogger<StudentCourseController> _logger;
        private readonly IMapper _mapper;

        public StudentCourseController(
            IStudentCourseService studentCourseService,
            IStudentCourseRepository studentCourseRepository,
            IGradeFeedbackService gradeFeedbackService,
            IUserService userService,
            IRbacService rbacService,
            ICourseService courseService,
            ILogger<StudentCourseController> logger,
            IMapper mapper
        )
        {
            _studentCourseService = studentCourseService;
            _studentCourseRepository = studentCourseRepository;
            _gradeFeedbackService = gradeFeedbackService;
            _userService = userService;
            _rbacService = rbacService;
            _courseService = courseService;
            _logger = logger;
            _mapper = mapper;
        }

        /// <summary>
        /// Enrolls a student to a course
        /// </summary>
        /// <remarks>
        /// **Authorization:** Admin
        /// </remarks>
        /// <param name="request">The StudentCourseCreateRequest model</param>
        /// <response code="201">Student has been successfully enrolled to this course.</response>
        /// <response code="400">Student's userId must be related to a student.</response>
        /// <response code="404">Student does not exist.</response>
        /// <response code="404">Course code does not relate to any courses.</response>
        /// <response code="500">Internal server error</response>
        [HttpPost("enroll")]
        [Authorize(Roles = "Admin")]
        [ProducesResponseType(typeof(StudentCourseCreateModel), StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public IActionResult EnrollStudentAdmin([FromBody] StudentCourseCreateRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new { message = "Invalid request format.", errors = ModelState.Values.SelectMany(v => v.Errors) });
            }

            try
            {
                var courseExists = _courseService.CourseExists(request.CourseCode);
                if (!courseExists)
                {
                    return BadRequest(new { message = "Course code does not relate to any courses." });
                }

                var studentRole = _rbacService.GetUserRole(request.StudentUserId);
                if (studentRole != UserRoles.Student)
                {
                    return BadRequest(new { message = "Student's userId must be related to a student." });
                }

                var studentExists = _userService.UserExists(request.StudentUserId);
                if (!studentExists)
                {
                    return NotFound(new { message = "Student does not exist." });
                }

                var newStudentCourse = _mapper.Map<StudentCourseCreateModel>(request);

                _studentCourseService.CreateStudentCourse(newStudentCourse);

                return StatusCode(201, new { message = "Student has been successfully enrolled in this course." });
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
        /// Updates the grade of a student for a specific course.
        /// </summary>
        /// <remarks>
        /// **Authorization:** Teacher
        /// </remarks>
        /// <param name="model">The student grade update model containing StudentUserId, CourseCode, and Grade.</param>
        /// <returns>Returns 200 if successful, 400/404 on errors.</returns>
        [HttpPut("update")]
        [Authorize(Roles = "Teacher")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public IActionResult UpdateStudentGrade([FromBody] StudentGradeUpdateViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new
                {
                    message = "Invalid request format.",
                    errors = ModelState.Values.SelectMany(v => v.Errors)
                });
            }

            try
            {
                // Validate student role
                var studentRole = _rbacService.GetUserRole(model.StudentUserId);
                if (studentRole != UserRoles.Student)
                {
                    return BadRequest(new { message = "Student's userId must be related to a student." });
                }

                // Check if student exists
                var studentExists = _userService.UserExists(model.StudentUserId);
                if (!studentExists)
                {
                    return NotFound(new { message = "Student does not exist." });
                }

                // Update the grade
                _studentCourseService.UpdateStudentGrade(model);

                return Ok(new { message = "Student's grade has been successfully updated." });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Internal server error occurred while updating student grade.");
                return StatusCode(500, new { message = "An internal server error has occurred." });
            }
        }


        /// <summary>
        /// Deletes a student's enrollment in a course.
        /// </summary>
        /// <remarks>
        /// **Authorization:** Admin
        /// </remarks>
        /// <param name="studentUserId">Student's user ID</param>
        /// <param name="courseCode">Course code</param>
        /// <response code="204">Successfully deleted</response>
        /// <response code="404">Student course not found</response>
        /// <response code="500">Internal server error</response>
        [HttpDelete("delete")]
        [Authorize(Roles = "Admin")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public IActionResult DeleteStudentCourse(string studentUserId, string courseCode)
        {
            try
            {
                _studentCourseService.DeleteStudentCourse(studentUserId, courseCode);
                return NoContent();
            }
            catch (ArgumentNullException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting student course.");
                return StatusCode(500, new { message = "Internal server error." });
            }
        }

        /// <summary>
        /// Gets all courses enrolled by a specific student.
        /// </summary>
        /// <remarks>
        /// **Authorization:** Student, Teacher, Admin
        /// </remarks>
        /// <param name="studentUserId">Student's user ID</param>
        /// <response code="200">List of student courses</response>
        /// <response code="500">Internal server error</response>
        [HttpGet("student/{studentUserId}")]
        [Authorize(Roles = "Student,Teacher,Admin")]
        [ProducesResponseType(typeof(IEnumerable<StudentCourseViewModel>), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public IActionResult GetCoursesByStudent(string studentUserId)
        {
            try
            {
                var courses = _studentCourseService.GetStudentCoursesOfStudent(studentUserId);
                return Ok(courses);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting student course.");
                return StatusCode(500, new { message = "Internal server error." });
            }
        }

        /// <summary>
        /// Gets all students enrolled in a specific course.
        /// </summary>
        /// <remarks>
        /// **Authorization:** Admin, Teacher
        /// </remarks>
        /// <param name="courseCode">Course code</param>
        /// <response code="200">List of student courses</response>
        /// <response code="500">Internal server error</response>
        [HttpGet("course/{courseCode}")]
        [Authorize(Roles = "Admin,Teacher")]
        [ProducesResponseType(typeof(IEnumerable<StudentCourseViewModel>), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public IActionResult GetStudentsByCourse(string courseCode)
        {
            try
            {
                var enrollments = _studentCourseService.GetStudentCoursesOfCourse(courseCode);
                return Ok(enrollments);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting student course.");
                return StatusCode(500, new { message = "Internal server error." });
            }
        }

        /// <summary>
        /// Gets all student-course enrollments.
        /// </summary>
        /// <remarks>
        /// **Authorization:** Admin
        /// </remarks>
        /// <response code="200">List of all student courses</response>
        /// <response code="500">Internal server error</response>
        [HttpGet("all")]
        [Authorize(Roles = "Admin")]
        [ProducesResponseType(typeof(IEnumerable<StudentCourse>), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public IActionResult GetAllStudentCourses()
        {
            try
            {
                var all = _studentCourseRepository.GetStudentCourses().ToList();
                return Ok(all);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting student course.");
                return StatusCode(500, new { message = "Internal server error." });
            }
        }
    }
}