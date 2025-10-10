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
        public string UserId { get; set; }
        public string FirstName { get; set; }
        public string MiddleName { get; set; }
        public string LastName { get; set; }
        public string HashedPassword { get; set; }  // Passwords stored in database must always be hashed
        public string Program { get; set; }
        public DateTime CreatedTime { get; set; } = DateTime.UtcNow;
        public UserRoles Role { get; set; } // ALIN: Himoan nakog UserRoles enums sa ASI.Basecode.Resources/Constants/Enums.cs
    }
}
