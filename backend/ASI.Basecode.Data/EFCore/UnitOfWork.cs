using ASI.Basecode.Data.Interfaces;
using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;
using Microsoft.IdentityModel.Tokens;
using System.Threading.Tasks;
using System.Threading;

namespace ASI.Basecode.Data.EFCore
{

    /// <summary>
    /// Unit of Work Implementation
    /// </summary>
    public class UnitOfWork<TContext> : IRepositoryFactory, IUnitOfWork<TContext>, IUnitOfWork
        where TContext : DbContext, IDisposable
    {
        private Dictionary<Type, object> repositories;
        private bool disposed;

        /// <summary>
        /// Gets the database context
        /// </summary>
        public DbContext Database { get; private set; }

        /// <summary>
        /// Initializes a new instance of the UnitOfWork class.
        /// </summary>
        /// <param name="serviceContext">The service context.</param>
        public UnitOfWork(AsiBasecodeDBContext serviceContext, TContext context)
        {
            Database = serviceContext;
            _context = context ?? throw new ArgumentNullException(nameof(context));
        }

        /// <inheritdoc/>
        public TContext _context { get; }

        /// <summary>
        /// Saves the changes to database
        /// </summary>
        public void SaveChanges()
        {
            Database.SaveChanges();
        }

        /// <summary>
        /// Performs application-defined tasks associated with freeing, releasing, or resetting unmanaged resources.
        /// </summary>
        public void Dispose()
        {
            Database.Dispose();
        }

        /// <inheritdoc/>
        public IRepository<TEntity> GetRepository<TEntity>()
            where TEntity : class
        {
            if (repositories == null)
            {
                repositories = new Dictionary<Type, object>();
            }

            var type = typeof(TEntity);
            if (!repositories.ContainsKey(type))
            {
                repositories[type] = new Repository<TEntity>(_context);
            }

            return (IRepository<TEntity>)repositories[type];
        }

        /// <inheritdoc/>
        public IRepositoryAsync<TEntity> GetRepositoryAsync<TEntity>()
            where TEntity : class
        {
            if (repositories == null)
            {
                repositories = new Dictionary<Type, object>();
            }

            var type = typeof(TEntity);
            if (!repositories.ContainsKey(type))
            {
                repositories[type] = new RepositoryAsync<TEntity>(_context);
            }

            return (IRepositoryAsync<TEntity>)repositories[type];
        }

        /// <inheritdoc/>
        public IRepositoryReadOnly<TEntity> GetReadOnlyRepository<TEntity>()
            where TEntity : class
        {
            if (repositories == null)
            {
                repositories = new Dictionary<Type, object>();
            }

            var type = typeof(TEntity);
            if (!repositories.ContainsKey(type))
            {
                repositories[type] = new RepositoryReadOnly<TEntity>(_context);
            }

            return (IRepositoryReadOnly<TEntity>)repositories[type];
        }

        /// <inheritdoc/>
        public IDbContextTransaction CreateTransaction()
        {
            return _context.Database.BeginTransaction();
        }
    }
}
