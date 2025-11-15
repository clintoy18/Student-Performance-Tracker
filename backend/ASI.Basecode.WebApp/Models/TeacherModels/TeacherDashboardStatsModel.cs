#nullable enable

using System;
using System.Collections.Generic;

namespace ASI.Basecode.WebApp.Models
{
    public class TeacherDashboardStatsModel
    {
        public int totalCourses { get; set; }
        public int totalStudents { get; set; }
        public required List<TeacherCourse> courses { get; set; }
    }

    public class TeacherCourse
    {
        public required string courseCode { get; set; }
        public required string courseName { get; set; }
        public required int studentCount { get; set; }

    }
}