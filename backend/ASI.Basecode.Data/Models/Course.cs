#nullable enable

using System;

namespace ASI.Basecode.Data.Models
{
    public class Course
    {
        public int Id { get; set; }

        public string CourseCode { get; set; } = null!;
        public string CourseName { get; set; } = null!;
        public string? CourseDescription { get; set; }
        public string? UserId { get; set; }   // FK to teacher (nullable)

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public User? User { get; set; }   // Navigation
    }
}
