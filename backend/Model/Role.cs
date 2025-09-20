using Student_Performance_Tracker_React_Asp.Server.Model;
using System.ComponentModel.DataAnnotations;

namespace Student_Performance_Tracker_React_Asp.Server.Model
{
    public class Role
    {
        [Key]
        public int RoleId { get; set; }

        [Required]
        [StringLength(50)]
        public string RoleName { get; set; } 

    }
}
