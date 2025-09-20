using Basecode.Data.Models;
using Basecode.Services.ServiceModels;
using static Basecode.Resources.Constants.Enums;

namespace Basecode.Services.Interfaces
{
    public interface IUserService
    {
        LoginResult AuthenticateUser(string userid, string password, ref User user);
        void AddUser(UserViewModel model);
    }
}
