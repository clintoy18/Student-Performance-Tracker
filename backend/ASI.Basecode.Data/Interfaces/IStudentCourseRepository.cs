using ASI.Basecode.Data.Models;
using System.Linq;

namespace ASI.Basecode.Data.Interfaces
{
    public interface IStudentCourseRepository
    {
        public IQueryable<StudentCourse> GetStudentCourses();

        public StudentCourse GetStudentCourse(string studentCourseId);

        public bool StudentCourseExists(string studentCourseId);

        public void AddStudentCourse(StudentCourse studentCourse);

        public void UpdateStudentCourse(StudentCourse studentCourse);

        public void DeleteStudentCourseByStudentCourseId(string studentCourseId);
    }
}