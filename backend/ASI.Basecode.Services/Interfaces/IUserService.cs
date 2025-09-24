using System.Threading.Tasks;
using ASI.Basecode.Data.Models;
using ASI.Basecode.Services.ServiceModels;
using static ASI.Basecode.Resources.Constants.Enums;

namespace ASI.Basecode.Services.Interfaces
{
    public interface IUserService
    {
        Task<LoginResult> AuthenticateUser(string userId, string password);
        Task RegisterUser(RegisterUserViewModel model);
        Task<User> FetchUser(string userId);
        Task UpdateUser(RegisterUserViewModel model);
        Task DeleteUser(string userId);
    }
}
