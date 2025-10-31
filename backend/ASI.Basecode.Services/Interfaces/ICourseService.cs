using System.Collections.Generic;
using System.Threading.Tasks;
using ASI.Basecode.Data.Models;
using ASI.Basecode.Services.ServiceModels;

namespace ASI.Basecode.Services.Interfaces
{
    public interface ICourseService
    {
        /// <summary>
        /// Fetch a course by its ID.
        /// </summary>
        public CourseViewModel FetchCourse(int courseId);
        /// <summary>
        /// Fetch a course by its Course Code.
        /// </summary>
        public CourseViewModel FetchCourseByCourseCode(string courseCode);

        /// <summary>
        /// Fetch all courses assigned to a specific user (e.g., teacher).
        /// </summary>
        public List<CourseViewModel> FetchCoursesByUser(string userId);

        /// <summary>
        /// Register a new course.
        /// </summary>
        void RegisterCourse(CourseViewModel model);

        /// <summary>
        /// Update an existing course.
        /// </summary>
        void UpdateCourse(CourseUpdateViewModel model);

        /// <summary>
        /// Delete a course by its ID.
        /// </summary>
        void DeleteCourse(int courseId);

        /// <summary>
        /// Delete a course by its course code.
        /// </summary>
        void DeleteCourseByCourseCode(string courseCode);

        /// <summary>
        /// Get all courses.
        /// </summary>
        public List<CourseViewModel> GetAllCourses();

        public bool CourseExists(string courseCode);

        /// <summary>
        /// Get the total count of courses.
        /// </summary>
        int GetCourseCount();

        
        void AssignTeacher(int courseId, string teacherId);

    }
}
