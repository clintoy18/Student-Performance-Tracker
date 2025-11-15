#nullable enable

using System;

namespace ASI.Basecode.WebApp.Models
{
    public class CourseViewControllerModel
    {
        public int Id { get; set; }
        public string? CourseCode { get; set; }
        public string? CourseName { get; set; }
        public string? CourseDescription { get; set; }

        public string? UserId { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}