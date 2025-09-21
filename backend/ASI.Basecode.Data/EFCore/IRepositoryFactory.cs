using System;
using ASI.Basecode.Data.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;
using Microsoft.IdentityModel.Tokens;

namespace ASI.Basecode.Data.EFCore
{
    public interface IRepositoryFactory
    {
        IRepository<T> GetRepository<T>()
            where T : class;

        IRepositoryAsync<T> GetRepositoryAsync<T>()
            where T : class;

        IRepositoryReadOnly<T> GetReadOnlyRepository<T>()
            where T : class;

        void Dispose();
    }
}
