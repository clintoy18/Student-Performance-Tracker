using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Diagnostics.CodeAnalysis;
using static ASI.Basecode.Resources.Constants.Enums;

namespace ASI.Basecode.Data.Models
{

    public class User
    {
        public int Id { get; set; }

        [Required, StringLength(50)]
        public string UserId { get; set; } = Guid.NewGuid().ToString();

        [Required, StringLength(50)]
        public string FirstName { get; set; } = null!;

        [StringLength(50)]
        public string? MiddleName { get; set; }

        [Required, StringLength(50)]
        public string LastName { get; set; } = null!;

        [Required]
        public string HashedPassword { get; set; } = null!;

        [StringLength(50)]
        public string? Program { get; set; }

        public DateTime CreatedTime { get; set; } = DateTime.UtcNow;

        public UserRoles Role { get; set; } = UserRoles.Student;
    }
}
