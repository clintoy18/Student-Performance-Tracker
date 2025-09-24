using System;
using ASI.Basecode.Data.EFCore;
using System.Collections.Generic;
using ASI.Basecode.Data.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;
using Microsoft.IdentityModel.Tokens;
using ASI.Basecode.Data.Repositories;
using System.Reflection;

namespace ASI.Basecode.Data.EFCore
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
