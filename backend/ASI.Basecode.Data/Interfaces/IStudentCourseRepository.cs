using ASI.Basecode.Data.Models;
using System.Linq;

namespace ASI.Basecode.Data.Interfaces
{
    public interface IStudentCourseRepository
    {
        public IQueryable<StudentCourse> GetStudentCourses();

        public StudentCourse GetStudentCourse(string userId, string courseCode);
        public IQueryable<StudentCourse> GetStudentCoursesByStudent(string userId);
        public IQueryable<StudentCourse> GetStudentCoursesByCourse(string courseCode);

        public bool StudentCourseExists(string studentCourseId);
        public bool StudentCourseExists(string studentUserId, string courseCode);

        public void AddStudentCourse(StudentCourse studentCourse);

        public void UpdateStudentCourse(StudentCourse studentCourse);

        public void DeleteStudentCourseByStudentCourseId(string studentCourseId);

        public IQueryable<StudentCourse> GetAllStudentCoursesWithUsersAndCourses();
    }
}