using ASI.Basecode.Data.Interfaces;
using ASI.Basecode.Data.Models;
using ASI.Basecode.Services.Interfaces;
using System.Threading.Tasks;
using static ASI.Basecode.Resources.Constants.Enums;

namespace ASI.Basecode.Services.Services
{
    public class RbacService : IRbacService
    {
        private readonly IUserRepository _userRepository;

        public RbacService(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        public UserRoles GetUserRole(string userId)
        {
            var user = _userRepository.GetUser(userId);
            return user.Role;
        }

        public bool IsTeacher(string userId)
        {
            var role = GetUserRole(userId);
            return role == UserRoles.Teacher;
        }

        public bool IsStudent(string userId)
        {
            var role = GetUserRole(userId);
            return role == UserRoles.Student;
        }

        public bool IsAdmin(string userId)
        {
            var role = GetUserRole(userId);
            return role == UserRoles.Admin;
        }
    }
}