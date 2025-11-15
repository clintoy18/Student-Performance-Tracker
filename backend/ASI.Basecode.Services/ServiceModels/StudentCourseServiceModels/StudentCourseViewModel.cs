using ASI.Basecode.Data.Models;

namespace ASI.Basecode.Services.ServiceModels
{
    public class StudentCourseViewModel
    {
        public string StudentCourseId { get; set; }
        public string StudentUserId { get; set; }
        public string CourseCode { get; set; }
        public decimal? Grade { get; set; }
        public string FirstName { get; set; }
        public string MiddleName { get; set; }
        public string LastName { get; set; }
        public string Program { get; set; }
        public Course Course { get; set; }
    }
}
