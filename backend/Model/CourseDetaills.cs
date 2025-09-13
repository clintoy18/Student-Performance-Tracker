using System.ComponentModel.DataAnnotations.Schema;

namespace Student_Performance_Tracker_React_Asp.Server.Model
{
    public class CourseDetaills
    {
        public int CourseDetaillsId { get; set; }
        public string CourseName { get; set; }
        public string CourseCode { get; set; }

        [ForeignKey("User")]
        public int UserId { get; set; }

        public string CourseDescription { get; set; }

        [ForeignKey("Degree")]
        public int DegreeId { get; set; }

    }
}
