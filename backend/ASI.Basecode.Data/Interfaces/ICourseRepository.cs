using ASI.Basecode.Data.Models;
using System.Linq;

namespace ASI.Basecode.Data.Interfaces
{
    public interface ICourseRepository
    {
        public IQueryable<Course> GetCourses();

        public Course GetCourse(string courseCode);

        public bool CourseExists(string courseCode);

        public void AddCourse(Course course);

        public void UpdateCourse(Course course);

        public void DeleteCourseByCourseCode(string courseCode);
    }
}