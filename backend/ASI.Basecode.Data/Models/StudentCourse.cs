using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Diagnostics.CodeAnalysis;

namespace ASI.Basecode.Data.Models
{
    public class StudentCourse  // Many-to-many between Student and Course
    {
        public int Id { get; set; }
        public string StudentCourseId { get; set; }
        public string UserId { get; set; }
        public string CourseCode { get; set; }
        public DateTime CreatedTime { get; set; }
        public User User { get; set; }  // Student user
        public Course Course { get; set; }
    }
}
