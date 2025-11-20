#nullable enable

using System;
using static ASI.Basecode.Resources.Constants.Enums;

namespace ASI.Basecode.Data.Models
{
    public class User
    {
        public int Id { get; set; }

        public string UserId { get; set; } = Guid.NewGuid().ToString();
        public string FirstName { get; set; } = null!;
        public string? MiddleName { get; set; }
        public string LastName { get; set; } = null!;
        public string HashedPassword { get; set; } = null!;
        public string? Program { get; set; }
        public bool IsDeleted { get; set; } = false;

        public DateTime CreatedTime { get; set; } = DateTime.UtcNow;
        public UserRoles Role { get; set; } = UserRoles.Student;
    }
}
