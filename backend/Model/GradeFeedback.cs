using System.ComponentModel.DataAnnotations.Schema;

namespace Student_Performance_Tracker_React_Asp.Server.Model
{
    public class GradeFeedback
    {
        public int Id { get; set; }

        [ForeignKey("CourseGrade")]
        public int CourseGradeId { get; set; }

        [ForeignKey("User")]
        public int UserId { get; set; }

        public string Feedback { get; set; }
    }
}
