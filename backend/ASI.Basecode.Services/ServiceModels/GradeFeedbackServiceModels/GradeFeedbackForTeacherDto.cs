#nullable enable
using System;
using ASI.Basecode.Data.Models;

namespace ASI.Basecode.Services.ServiceModels
{
    public class GradeFeedbackForTeacherDto
    {
        public required string Feedback { get; set; }   // teacher feedback
        public string? StudentCourseId { get; set; }
        public string? UserId { get; set; }
    }
}
