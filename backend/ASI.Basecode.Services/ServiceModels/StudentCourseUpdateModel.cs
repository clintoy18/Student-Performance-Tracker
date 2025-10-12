using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static ASI.Basecode.Resources.Constants.Enums;

namespace ASI.Basecode.Services.ServiceModels
{
    public class StudentCourseUpdateModel
    {
        [Required(ErrorMessage = "Student's UserID is required.")]
        public string StudentUserId { get; set; }

        [Range(0.00, 100.00, ErrorMessage = "Grade must be between 0 and 100.")]
        [Required(ErrorMessage = "Grade is required.")]
        public decimal Grade { get; set; }


        [Required(ErrorMessage = "Course code is required.")]
        public string CourseCode { get; set; }
    }
}
