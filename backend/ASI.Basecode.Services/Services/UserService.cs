using ASI.Basecode.Data.Interfaces;
using ASI.Basecode.Data.Models;
using ASI.Basecode.Services.Interfaces;
using ASI.Basecode.Services.Manager;
using ASI.Basecode.Services.ServiceModels;
using AutoMapper;
using System;
using System.Data.Entity;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using static ASI.Basecode.Resources.Constants.Enums;

namespace ASI.Basecode.Services.Services
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _repository;
        private readonly IMapper _mapper;

        public UserService(IUserRepository repository, IMapper mapper)
        {
            _mapper = mapper;
            _repository = repository;
        }

        public async Task<LoginResult> AuthenticateUser(string userId, string password)
        {
            var passwordKey = PasswordManager.EncryptPassword(password);
            var user = await _repository.GetUsers().Where(x => x.UserId == userId &&
                                                     x.HashedPassword == passwordKey).FirstOrDefaultAsync();

            return user != null ? LoginResult.Success : LoginResult.Failed;
        }

        public async Task<User> FetchUser(string userId)
        {
            if (await _repository.UserExistsAsync(userId))
            {
                return await _repository.GetUserAsync(userId);
            }
            else
            {
                throw new InvalidDataException(Resources.Messages.Errors.UserExists);
            }
        }

        public async Task RegisterUser(RegisterUserViewModel model)
        {
            ArgumentNullException.ThrowIfNull(model);
            var user = new User();
            if (await _repository.UserExistsAsync(model.UserId))
            {
                _mapper.Map(model, user);
                user.HashedPassword = PasswordManager.EncryptPassword(model.Password);
                await _repository.AddUserAsync(user);
            }
            else
            {
                throw new InvalidDataException(Resources.Messages.Errors.UserExists);
            }
        }

        // Not an admin method
        public async Task UpdateUser(RegisterUserViewModel model)
        {
            ArgumentNullException.ThrowIfNull(model);

            var existingUser = await _repository.GetUserAsync(model.UserId);    // Fetch the existing user to preserve current password if not updating
            var userToUpdate = _mapper.Map<User>(model);    // Map the view model to a new user entity

            // Password update logic
            if (!string.IsNullOrWhiteSpace(model.Password))
            {
                userToUpdate.HashedPassword = PasswordManager.EncryptPassword(model.Password);
            }
            else
            {
                userToUpdate.HashedPassword = existingUser.HashedPassword;
            }
            await _repository.UpdateUserAsync(userToUpdate);
        }

        public async Task DeleteUser(string userId)
        {
            if (!await _repository.UserExistsAsync(userId))
            {
                throw new InvalidDataException("User not found.");
            }

            await _repository.DeleteUserByIdAsync(userId);
        }
    }
}
