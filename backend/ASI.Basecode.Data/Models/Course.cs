using System;
using System.ComponentModel.DataAnnotations;

namespace ASI.Basecode.Data.Models
{
    public class Course
    {
        public int Id { get; set; }

        [Required, StringLength(50)]
        public string CourseCode { get; set; } = null!;

        [Required, StringLength(100)]
        public string CourseName { get; set; } = null!;

        public string? CourseDescription { get; set; }

        [StringLength(50)]
        public string? UserId { get; set; }  // Nullable teacher FK

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public User? User { get; set; }  // Navigation property (teacher)
    }
}
