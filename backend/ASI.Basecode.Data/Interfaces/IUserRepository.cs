using ASI.Basecode.Data.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using static ASI.Basecode.Resources.Constants.Enums;

namespace ASI.Basecode.Data.Interfaces
{
    public interface IUserRepository
    {
        IQueryable<User> GetUsers();
        User GetUser(string userId);
        bool UserExists(string userId);
        void AddUser(User user);
        void UpdateUser(User user);
        void DeleteUserById(string userId);
        IQueryable<User> GetRecentUsers(int count);
        IQueryable<User> GetUsersByRole(UserRoles role);


    }
}