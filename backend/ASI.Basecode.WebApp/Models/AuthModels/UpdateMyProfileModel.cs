

using System.ComponentModel.DataAnnotations;

namespace ASI.Basecode.WebApp.Models
{
    public class UpdateMyProfileModel
    {
        [Required] public string FirstName { get; set; }
        public string MiddleName { get; set; }
        [Required] public string LastName { get; set; }
        public string Program { get; set; }
        public string Password { get; set; } // optional
    }
}