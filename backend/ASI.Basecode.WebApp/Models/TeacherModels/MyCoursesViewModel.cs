#nullable enable

using System;

namespace ASI.Basecode.WebApp.Models
{
    public class MyCoursesViewModel
    {
        public int id { get; set; }

        public string courseCode { get; set; } = null!;
        public string courseName { get; set; } = null!;
        public string? courseDescription { get; set; }
        public string? teacherUserId { get; set; }   // FK to teacher (nullable)

        public DateTime createdAt { get; set; }

        public int studentCount { get; set; }
    }
}