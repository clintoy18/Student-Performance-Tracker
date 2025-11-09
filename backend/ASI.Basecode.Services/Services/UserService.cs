using ASI.Basecode.Data.Interfaces;
using ASI.Basecode.Data.Models;
using ASI.Basecode.Data.Repositories;
using ASI.Basecode.Services.Interfaces;
using ASI.Basecode.Services.Manager;
using ASI.Basecode.Services.ServiceModels;
using AutoMapper;
using System;
using System.Collections.Generic;
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

        public LoginResult AuthenticateUser(string userId, string password)
        {
            var passwordKey = PasswordManager.EncryptPassword(password);
            var user = _repository.GetUsers().Where(x => x.UserId == userId &&
                                                     x.HashedPassword == passwordKey).FirstOrDefault();

            return user != null ? LoginResult.Success : LoginResult.Failed;
        }

        public User FetchUser(string userId)
        {
            if (_repository.UserExists(userId))
            {
                return _repository.GetUser(userId);
            }
            else
            {
                throw new InvalidDataException(Resources.Messages.Errors.UserNotExist);
            }
        }

        public void RegisterUser(RegisterUserViewModel model)
        {
            ArgumentNullException.ThrowIfNull(model);

            // Check if this is the first user
            bool isFirstUser = !_repository.GetUsers().Any();

            if (!_repository.UserExists(model.UserId))
            {
                var user = new User();
                _mapper.Map(model, user);

                // Assign Admin role if first user, otherwise default (e.g., Student)
                user.Role = isFirstUser ? UserRoles.Admin : UserRoles.Student;

                user.HashedPassword = PasswordManager.EncryptPassword(model.Password);
                _repository.AddUser(user);
            }
            else
            {
                throw new InvalidDataException(Resources.Messages.Errors.UserExists);
            }
        }

        // For admin
        public void RegisterUserAdmin(RegisterUserAdminModel model)
        {
            ArgumentNullException.ThrowIfNull(model);

            var user = new User();
            _mapper.Map(model, user);

            user.HashedPassword = PasswordManager.EncryptPassword(model.Password);
            _repository.AddUser(user);
        }

        public void UpdateUserAdmin(RegisterUserAdminModel model)
        {
            ArgumentNullException.ThrowIfNull(model);

            var existingUser = _repository.GetUser(model.UserId);    // Fetch the existing user to preserve current password if not updating
            _mapper.Map(model, existingUser);    // Map the view model to a new user entity

            // Password update logic
            if (!string.IsNullOrWhiteSpace(model.Password))
            {
                existingUser.HashedPassword = PasswordManager.EncryptPassword(model.Password);
            }
            _repository.UpdateUser(existingUser);
        }

        public void DeleteUser(string userId)
        {
            if (!_repository.UserExists(userId))
            {
                throw new InvalidDataException("User not found.");
            }

            _repository.DeleteUserById(userId);
        }

        // Add this method to your UserService class
        public List<UserViewAdminModel> GetAllUsers()
        {
            var users = _repository.GetUsers();
            return users.Select(u => new UserViewAdminModel
            {
                UserId = u.UserId,
                FirstName = u.FirstName,
                MiddleName = u.MiddleName,
                LastName = u.LastName,
                Program = u.Program,
                Role = u.Role,
                CreatedTime = u.CreatedTime
            }).ToList();
        }

        public bool UserExists(string userId)
        {
            return _repository.UserExists(userId);
        }

        public List<UserViewAdminModel> GetRecentUsers(int count)
        {
            var users = _repository.GetRecentUsers(count);
            return users.Select(u => new UserViewAdminModel
            {
                UserId = u.UserId,
                FirstName = u.FirstName,
                MiddleName = u.MiddleName,
                LastName = u.LastName,
                Program = u.Program,
                Role = u.Role,
                CreatedTime = u.CreatedTime
            }).ToList();
        }

        public UserStatisticsViewModel GetUserStatistics()
        {
            var users = _repository.GetUsers().ToList();

            return new UserStatisticsViewModel
            {
                TotalUsers = users.Count,
                TotalStudents = users.Count(u => u.Role == UserRoles.Student),
                TotalTeachers = users.Count(u => u.Role == UserRoles.Teacher),
                TotalAdmins = users.Count(u => u.Role == UserRoles.Admin)
            };
        }

        public List<User> GetUsersByRole(UserRoles role)
        {
            return _repository.GetUsers()
                .Where(u => u.Role == role)
                .ToList();
        }

    }
}
