using System;
using System.ComponentModel.DataAnnotations;
using ASI.Basecode.Data.Models;

public class CourseListViewModel
{
    public int Id { get; set; }
    public string CourseCode { get; set; }
    public string CourseName { get; set; }
    public string CourseDescription { get; set; }

    public User AssignedTeacher { get; set; } = null;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
} 