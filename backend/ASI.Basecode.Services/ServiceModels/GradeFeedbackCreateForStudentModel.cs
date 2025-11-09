using System;
using System.ComponentModel.DataAnnotations;
using ASI.Basecode.Data.Models;

public class GradeFeedbackCreateForStudentModel
{
    [Required(ErrorMessage = "Feedback is required.")]
    [StringLength(1000, ErrorMessage = "Feedback can only be 1000 characters long.")]
    public string StudentFeedback { get; set; }

    [Required(ErrorMessage = "Coursecode is required.")]
    public string CourseCode { get; set; }

    [Required(ErrorMessage = "Student UserID is required")]
    public string StudentUserId { get; set; }
} 