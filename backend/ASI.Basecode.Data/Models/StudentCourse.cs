using System;
using System.ComponentModel.DataAnnotations;

namespace ASI.Basecode.Data.Models
{
    public class StudentCourse
    {
        public int Id { get; set; }

        [Required, StringLength(50)]
        public string StudentCourseId { get; set; } = Guid.NewGuid().ToString();

        [Required, StringLength(50)]
        public string UserId { get; set; } = null!;  // FK to Users

        [Required, StringLength(50)]
        public string CourseCode { get; set; } = null!;  // FK to Courses

        public decimal? Grade { get; set; }

        public DateTime CreatedTime { get; set; } = DateTime.UtcNow;

        public User User { get; set; } = null!;  // Navigation property
        public Course Course { get; set; } = null!;
    }
}
