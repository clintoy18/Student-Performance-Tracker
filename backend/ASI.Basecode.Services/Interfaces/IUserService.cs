using System.Collections.Generic;
using System.Threading.Tasks;
using ASI.Basecode.Data.Models;
using ASI.Basecode.Services.ServiceModels;
using static ASI.Basecode.Resources.Constants.Enums;

namespace ASI.Basecode.Services.Interfaces
{
    public interface IUserService
    {
        LoginResult AuthenticateUser(string userId, string password);
        string RegisterUser(RegisterUserViewModel model);
        User FetchUser(string userId);
        // public User FetchUserNoNullException(string userId);
        // void UpdateUser(RegisterUserViewModel model);
        void DeleteUser(string userId);
        void RegisterUserAdmin(RegisterUserAdminModel model);
        void UpdateUserAdmin(RegisterUserAdminModel model);
        public List<UserViewAdminModel> GetAllUsers();
        public bool UserExists(string userId);
        public List<UserViewAdminModel> GetRecentUsers(int count);
        public UserStatisticsViewModel GetUserStatistics();
        public List<User> GetUsersByRole(UserRoles role);

    }
}
