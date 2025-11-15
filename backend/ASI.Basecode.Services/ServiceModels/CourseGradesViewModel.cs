using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ASI.Basecode.Services.ServiceModels
{
    public class CourseGradesViewModel
    {
        public string CourseCode { get; set; }
        public string CourseName { get; set; }
        public List<StudentCourseGradeViewModel> StudentGrades { get; set; } = new();
    }
}
