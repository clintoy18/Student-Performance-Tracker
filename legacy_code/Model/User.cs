using Student_Performance_Tracker_React_Asp.Server.Models;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Data;

namespace Student_Performance_Tracker_React_Asp.Server.Model
{


    public class User
    {
        [Key]
        public int UserId { get; set; }

        [Required]
        [StringLength(255)]
        public string HashedPassword { get; set; }

        [Required]
        [StringLength(100)]
        public string Firstname { get; set; }

        [StringLength(100)]
        public string Middlename { get; set; }

        [Required]
        [StringLength(100)]
        public string Lastname { get; set; }

        [Required]

        [ForeignKey("Role")]
        public int RoleId { get; set; }
        public Role Role { get; set; }

        [ForeignKey("Degree")]
        public int DegreeId { get; set; }

        // Navigation property
        public Degree Degree { get; set; }
    }
}
