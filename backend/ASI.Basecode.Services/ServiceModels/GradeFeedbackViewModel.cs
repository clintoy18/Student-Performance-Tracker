using System;

public class GradeFeedbackViewModel
{
    public int Id { get; set; }
    public string Feedback { get; set; }
    public string StudentCourseId { get; set; }
    public DateTime CreatedTime { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedTime { get; set; } = DateTime.UtcNow;

    // Teacher info (who gave feedback)
    public string TeacherUserId { get; set; }
    public string TeacherName { get; set; }

    // Student course info
    public string CourseCode { get; set; }
    public string CourseName { get; set; } // Add to Course model if needed
}