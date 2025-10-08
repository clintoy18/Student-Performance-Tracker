using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Diagnostics.CodeAnalysis;

namespace ASI.Basecode.Data.Models
{
    public class Course
    {
        public int Id { get; set; }
        public string CourseCode { get; set; }
        public string CourseName { get; set; }
        public string CourseDescription { get; set; }

        public string UserId { get; set; }
        public DateTime CreatedAt { get; set; }
        public User User { get; set; }  // Teacher only. Validate data in Service layer
    }
}
