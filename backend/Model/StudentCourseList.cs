using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Student_Performance_Tracker_React_Asp.Server.Model
{
    public class StudentCourseList
    {
        [Key]
        public int Id { get; set; }

        // Foreign Key to User
        [ForeignKey("User")]
        public int UserId { get; set; }
        public User User { get; set; }

        // Foreign Key to Course
        [ForeignKey("Degree")]
        public int DegreeId { get; set; }
        public Degree Degree { get; set; }
    }
}
