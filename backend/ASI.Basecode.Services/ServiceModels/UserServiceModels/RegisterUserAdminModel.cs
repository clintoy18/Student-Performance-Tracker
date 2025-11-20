using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static ASI.Basecode.Resources.Constants.Enums;

namespace ASI.Basecode.Services.ServiceModels
{
    public class RegisterUserAdminModel
    {
        [Required(ErrorMessage = "Username is required.")]
        [StringLength(20, ErrorMessage = "User ID must be 20 characters at most.")]
        public string UserId { get; set; }

        [Required(ErrorMessage = "First name is required.")]
        [StringLength(100, ErrorMessage = "This field cannot exceed 100 characters.")]
        public string FirstName { get; set; }

        [StringLength(100, ErrorMessage = "This field cannot exceed 100 characters.")]

        public string MiddleName { get; set; }

        [Required(ErrorMessage = "Last name is required.")]
        [StringLength(100, ErrorMessage = "This field cannot exceed 100 characters.")]
        public string LastName { get; set; }

        [StringLength(50, ErrorMessage = "Your password must not exceed 50 characters.")]
        public string Password { get; set; }

        [StringLength(50, ErrorMessage = "Confirm password must not exceed 50 characters.")]
        [Compare("Password", ErrorMessage = "Password and Confirmation Password must match.")]
        public string ConfirmPassword { get; set; }

        [StringLength(100, ErrorMessage = "This field must not exceed 50 characters.")]
        public string Program { get; set; }

        [Required(ErrorMessage = "Role is required.")]
        [EnumDataType(typeof(UserRoles), ErrorMessage = "Please select a valid role.")]
        public UserRoles Role { get; set; }
    }
}
