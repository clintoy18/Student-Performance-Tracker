using ASI.Basecode.Data.Models;
using ASI.Basecode.Services.Interfaces;
using ASI.Basecode.Services.ServiceModels;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.IO;
using System.Linq;

namespace ASI.Basecode.WebApp.Controllers
{
    [ApiController]
    [Route("api/course/")]
    public class CourseController : ControllerBase
    {
        private readonly ICourseService _courseService;
        private readonly ILogger<CourseController> _logger;

        public CourseController(ICourseService courseService, ILogger<CourseController> logger)
        {
            _courseService = courseService;
            _logger = logger;
        }

        /// <summary>
        /// Retrieves all courses
        /// </summary>
        /// <returns>List of courses</returns>
        [HttpGet("list")]
        public IActionResult GetAllCourses()
        {
            try
            {
                var courses = _courseService.GetAllCourses()
                    .Select(c => new
                    {
                        c.Id,
                        c.CourseCode,
                        c.CourseName,
                        c.CourseDescription
                    })
                    .ToList();

                return Ok(courses);
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
        [HttpGet("{courseId:int}")]
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
        /// Adds a new course
        /// </summary>
        [HttpPost("add")]
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
        [HttpPut("update/{courseId:int}")]
        public IActionResult UpdateCourse(int courseId, [FromBody] CourseViewModel model)
        {
            if (!ModelState.IsValid)
                return BadRequest(new { message = "Invalid request format.", errors = ModelState.Values.SelectMany(v => v.Errors) });

            if (courseId != model.Id)
                return BadRequest(new { message = "Course ID in route does not match request body." });

            try
            {
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
                return StatusCode(500, new { message = ex.Message, stack = ex.StackTrace });
            }

        }

        /// <summary>
        /// Deletes a course
        /// </summary>
        [HttpDelete("delete/{courseId:int}")]
        public IActionResult DeleteCourse(int courseId)
        {
            if (courseId <= 0)
                return BadRequest(new { message = "Course ID is required." });

            try
            {
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
    }
}
