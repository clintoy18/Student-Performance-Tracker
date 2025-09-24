using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace ASI.Basecode.Data.EFCore
{
    /// <summary>
    /// Unit of Work Interface
    /// </summary>
    public interface IUnitOfWork : IDisposable
    {
        /// <summary>
        /// Gets the database context
        /// </summary>
        /// <value>
        /// The database.
        /// </value>
        DbContext Database { get; }
        /// <summary>
        /// Saves the changes to database
        /// </summary>
        void SaveChanges();

        IDbContextTransaction CreateTransaction();
    }

    public interface IUnitOfWork<TContext> : IUnitOfWork
        where TContext : DbContext
    {
        TContext _context { get; }
    }
}
