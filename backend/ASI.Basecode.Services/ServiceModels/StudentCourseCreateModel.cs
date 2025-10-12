using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static ASI.Basecode.Resources.Constants.Enums;

namespace ASI.Basecode.Services.ServiceModels
{
    public class StudentCourseCreateModel
    {
        [Required(ErrorMessage = "Student's UserID is required.")]
        public string UserId { get; set; }

        [Required(ErrorMessage = "Course code is required.")]
        public string CourseCode { get; set; }
    }
}
