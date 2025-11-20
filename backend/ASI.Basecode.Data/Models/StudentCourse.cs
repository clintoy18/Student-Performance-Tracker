using System;

namespace ASI.Basecode.Data.Models
{
    public class StudentCourse
    {
        public int Id { get; set; }

        public string StudentCourseId { get; set; } = Guid.NewGuid().ToString();
        public string UserId { get; set; } = null!;
        public string CourseCode { get; set; } = null!;

        public decimal? Grade { get; set; }
        public bool IsDeleted { get; set; } = false;

        public DateTime CreatedTime { get; set; } = DateTime.UtcNow;

        public User User { get; set; } = null!;
        public Course Course { get; set; } = null!;
    }
}
