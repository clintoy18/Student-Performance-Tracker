using ASI.Basecode.Data.EFCore;
using ASI.Basecode.Data.Interfaces;
using ASI.Basecode.Data.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;

namespace ASI.Basecode.Data.Repositories
{
    public class UserRepository : BaseRepository<User>, IUserRepository
    {
        public UserRepository(IUnitOfWork unitOfWork) : base(unitOfWork)
        {

        }

        public IQueryable<User> GetUsers()
        {
            return GetDbSet<User>();
        }

        public User GetUser(string userId)
        {
            return GetDbSet<User>().FirstOrDefault(u => u.UserId == userId);
        }

        public bool UserExists(string userId)
        {
            return GetDbSet<User>().Any(x => x.UserId == userId);
        }

        public void AddUser(User user)
        {
            ArgumentNullException.ThrowIfNull(user);
            GetDbSet<User>().Add(user);
            UnitOfWork.SaveChanges();
        }

        public void UpdateUser(User user)
        {
            ArgumentNullException.ThrowIfNull(user);
            GetDbSet<User>().Update(user);
            UnitOfWork.SaveChanges();
        }

        public void DeleteUserById(string userId)
        {
            var user = GetDbSet<User>().FirstOrDefault(u => u.UserId = userId);
            GetDbSet<User>().Remove(user);
            UnitOfWork.SaveChanges();
        }
    }
}