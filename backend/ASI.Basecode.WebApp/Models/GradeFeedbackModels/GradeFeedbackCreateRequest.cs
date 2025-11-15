using System;
using System.ComponentModel.DataAnnotations;
using ASI.Basecode.Data.Models;

public class GradeFeedbackCreateRequestModel
{
    [Required(ErrorMessage = "Feedback is required.")]
    [StringLength(1000, ErrorMessage = "Feedback can only be 1000 characters long.")]
    public string Feedback { get; set; }

    // [Required(ErrorMessage = "Teacher UserId is required.")]
    // public string TeacherUserId { get; set; }

    [Required(ErrorMessage = "Student UserId of related course is required.")]
    public string CourseStudentUserId { get; set; }

    [Required(ErrorMessage = "Coursecode is required.")]
    public string CourseCode { get; set; }
} 