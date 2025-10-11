using System;
using ASI.Basecode.Data.Models;

public class GradeFeedbackCreateModel
{
    public int Id { get; set; }
    public string Feedback { get; set; }

    public string TeacherUserId { get; set; }
    public Course Course { get; set; }
}