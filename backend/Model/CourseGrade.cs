using System.ComponentModel.DataAnnotations.Schema;

namespace Student_Performance_Tracker_React_Asp.Server.Model
{
    public class CourseGrade
    {
        public int Id { get; set; }

        [ForeignKey("User")]
        public int UserId { get; set; }

        [ForeignKey("CourseDetails")]
        public int CourseDetailsId { get; set; }

        public float Grade { get; set; }


    }
}
