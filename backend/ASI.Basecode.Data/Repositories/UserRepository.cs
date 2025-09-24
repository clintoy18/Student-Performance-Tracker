using ASI.Basecode.Data.EFCore;
using ASI.Basecode.Data.Interfaces;
using ASI.Basecode.Data.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

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

        public async Task<User> GetUserAsync(string userId)
        {
            return await GetDbSet<User>().FirstOrDefaultAsync(u => u.UserId == userId);
        }

        public async Task<bool> UserExistsAsync(string userId)
        {
            return await GetDbSet<User>().AnyAsync(x => x.UserId == userId);
        }

        public async Task AddUserAsync(User user)
        {
            ArgumentNullException.ThrowIfNull(user);
            await GetDbSet<User>().AddAsync(user);
            await UnitOfWork.SaveChangesAsync();
        }

        public async Task UpdateUserAsync(User user)
        {
            ArgumentNullException.ThrowIfNull(user);
            GetDbSet<User>().Update(user);
            await UnitOfWork.SaveChangesAsync();
        }

        public async Task DeleteUserByIdAsync(string userId)
        {
            var user = await GetDbSet<User>().FindAsync(userId);
            GetDbSet<User>().Remove(user);
            await UnitOfWork.SaveChangesAsync();
        }

    }
}
