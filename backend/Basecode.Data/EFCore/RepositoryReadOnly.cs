using System;
using Basecode.Data.EFCore;
using Basecode.Data.Interfaces;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;
using Microsoft.IdentityModel.Tokens;
using Basecode.Data.Repositories;
using System.Reflection;

namespace Basecode.Data.EFCore
{
    public class RepositoryReadOnly<T> : BaseRepository<T>, IRepositoryReadOnly<T>
        where T : class
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="RepositoryReadOnly{T}"/> class.
        /// </summary>
        /// <param name="context">Holds the connection to the database.</param>
        public RepositoryReadOnly(DbContext context)
            : base(context)
        {
        }
    }
}
