using ASI.Basecode.Data.Models;
using System.Threading.Tasks;
using static ASI.Basecode.Resources.Constants.Enums;

namespace ASI.Basecode.Services.Interfaces
{
    public interface IRbacService
    {
        public bool IsTeacher(string userId);
        public bool IsStudent(string userId);
        public bool IsAdmin(string userId);
        public UserRoles GetUserRole(string userId);
    }
}