using System.Collections.Generic;
using System.Threading.Tasks;
using ASI.Basecode.Data.Models;
using ASI.Basecode.Services.ServiceModels;
using static ASI.Basecode.Resources.Constants.Enums;

namespace ASI.Basecode.Services.Interfaces
{
    public interface IStudentCourseService
    {
        public void CreateStudentCourse(StudentCourseCreateModel model);

        public void UpdateStudentGrade(StudentGradeUpdateViewModel model);
        public void DeleteStudentCourse(string studentUserId, string courseCode);

        public List<StudentCourse> GetStudentCoursesOfStudent(string userId);

        public List<StudentCourseViewModel> GetStudentCoursesOfCourse(string courseCode);
    }
}
