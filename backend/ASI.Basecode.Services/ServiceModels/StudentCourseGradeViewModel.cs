using System;
using System.ComponentModel.DataAnnotations;

namespace ASI.Basecode.Services.ServiceModels
{
        public class StudentCourseGradeViewModel
        {
            public string StudentId { get; set; }
            public string StudentName { get; set; }
            public decimal? Grade { get; set; }
        }

}
