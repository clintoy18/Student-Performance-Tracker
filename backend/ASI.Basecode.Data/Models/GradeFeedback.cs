using System;
using System.ComponentModel.DataAnnotations;

namespace ASI.Basecode.Data.Models
{
    public class GradeFeedback
    {
        public int Id { get; set; }

        public string? Feedback { get; set; }  // Teacher feedback
        public string? StudentFeedback { get; set; }

        [StringLength(50)]
        public string? StudentCourseId { get; set; }  // FK to StudentCourse

        [StringLength(50)]
        public string? UserId { get; set; }  // FK to Teacher (User)

        public DateTime CreatedTime { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedTime { get; set; } = DateTime.UtcNow;

        public User? User { get; set; }
        public StudentCourse? StudentCourse { get; set; }
    }
}
