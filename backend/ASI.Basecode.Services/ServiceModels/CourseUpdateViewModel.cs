using System;
using System.ComponentModel.DataAnnotations;

namespace ASI.Basecode.Services.ServiceModels
{
    public class CourseUpdateViewModel
    {
        public int Id { get; set; }

      
        [Required(ErrorMessage = "Course name is required.")]
        [StringLength(100, ErrorMessage = "Course name must not exceed 100 characters.")]
        public string CourseName { get; set; }

        [StringLength(300, ErrorMessage = "Course description must not exceed 300 characters.")]
        public string CourseDescription { get; set; }

        // [(ErrorMessage = "User ID (Teacher) is required.")]
        // [StringLength(20, ErrorMessage = "User ID must not exceed 20 characters.")]
        public string UserId { get; set; }

    }
}
