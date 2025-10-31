#nullable enable
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Diagnostics.CodeAnalysis;

namespace ASI.Basecode.Data.Models
{

    public class GradeFeedback
    {
        public int Id { get; set; }
        public required string Feedback { get; set; }
        public string? StudentCourseId { get; set; }
        public string? UserId { get; set; }
        public DateTime CreatedTime { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedTime { get; set; } = DateTime.UtcNow;
        public User? User { get; set; }  // Teachers only can feedback
        public StudentCourse? StudentCourse { get; set; }
    }
}
