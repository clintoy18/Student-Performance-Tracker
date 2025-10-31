using ASI.Basecode.Data.Models;
using System.Linq;

namespace ASI.Basecode.Data.Interfaces
{
    public interface IUserRepository
    {
        IQueryable<User> GetUsers();
        User GetUser(string userId);
        public User GetUserNoNullException(string userId);

        bool UserExists(string userId);
        void AddUser(User user);
        void UpdateUser(User user);
        void DeleteUserById(string userId);
        IQueryable<User> GetRecentUsers(int count);
    }
}