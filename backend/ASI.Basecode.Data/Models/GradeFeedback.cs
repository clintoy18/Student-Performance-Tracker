using System;

namespace ASI.Basecode.Data.Models
{
    public class GradeFeedback
    {
        public int Id { get; set; }

        public string? Feedback { get; set; }
        public string? StudentFeedback { get; set; }

        public string? StudentCourseId { get; set; }
        public string? UserId { get; set; }

        public DateTime CreatedTime { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedTime { get; set; } = DateTime.UtcNow;

        public User? User { get; set; }
        public StudentCourse? StudentCourse { get; set; }
    }
}
