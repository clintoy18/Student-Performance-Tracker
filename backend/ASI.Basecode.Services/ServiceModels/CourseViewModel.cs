using System;
using System.ComponentModel.DataAnnotations;

namespace ASI.Basecode.Services.ServiceModels
{
    public class CourseViewModel
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "Course code is required.")]
        [StringLength(20, ErrorMessage = "Course code must not exceed 20 characters.")]
        public string CourseCode { get; set; }

        [Required(ErrorMessage = "Course name is required.")]
        [StringLength(100, ErrorMessage = "Course name must not exceed 100 characters.")]
        public string CourseName { get; set; }

        [StringLength(300, ErrorMessage = "Course description must not exceed 300 characters.")]
        public string CourseDescription { get; set; }

        // [(ErrorMessage = "User ID (Teacher) is required.")]
        // [StringLength(20, ErrorMessage = "User ID must not exceed 20 characters.")]
        public string? UserId { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
