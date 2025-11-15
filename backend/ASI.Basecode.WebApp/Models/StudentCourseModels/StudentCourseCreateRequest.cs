using System;
using System.ComponentModel.DataAnnotations;
using ASI.Basecode.Data.Models;

public class StudentCourseCreateAdminRequest
{
    [Required(ErrorMessage = "Student's UserID is required.")]
    public string StudentUserId { get; set; }

    // [Range(0.00, 100.00, ErrorMessage = "Grade must be between 0 and 100.")]
    // public decimal? Grade { get; set; }

    [Required(ErrorMessage = "Course code is required.")]
    public string CourseCode { get; set; }
}