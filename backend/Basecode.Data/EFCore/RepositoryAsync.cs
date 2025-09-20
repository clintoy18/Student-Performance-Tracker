using System;
using Basecode.Data.EFCore;
using Basecode.Data.Interfaces;
using Basecode.Data.EFCore.Paging;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;
using Microsoft.IdentityModel.Tokens;
using Basecode.Data.Repositories;
using System.Reflection;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Microsoft.EntityFrameworkCore.Query;
using System.Linq.Expressions;
using System.Linq;
using System.Threading.Tasks;
using System.Threading;

namespace Basecode.Data.EFCore
{
    public class RepositoryAsync<T> : IRepositoryAsync<T>
    where T : class
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="RepositoryAsync{T}"/> class.
        /// </summary>
        /// <param name="dbContext">Holds the connection to the database.</param>
        public RepositoryAsync(DbContext dbContext)
        {
            DbContext = dbContext;
            DbSet = DbContext?.Set<T>();
        }

        /// <summary>
        /// Gets or sets the connection to the database.
        /// </summary>
        public DbContext DbContext { get; set; }

        /// <summary>
        /// Gets or sets the entity from the database.
        /// </summary>
        public DbSet<T> DbSet { get; set; }

        /// <inheritdoc/>
        public async Task<T> SingleAsync(
            Expression<Func<T, bool>> predicate = null,
            Func<IQueryable<T>, IOrderedQueryable<T>> orderBy = null,
            Func<IQueryable<T>, IIncludableQueryable<T, object>> include = null,
            bool disableTracking = true)
        {
            IQueryable<T> query = DbSet;
            if (disableTracking)
            {
                query = query.AsNoTracking();
            }

            if (include != null)
            {
                query = include(query);
            }

            if (predicate != null)
            {
                query = query.Where(predicate);
            }

            if (orderBy != null)
            {
                return await orderBy(query).FirstOrDefaultAsync().ConfigureAwait(false);
            }

            return await query.FirstOrDefaultAsync().ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public Task<IPaginate<T>> GetListAsync(
            Expression<Func<T, bool>> predicate = null,
            Func<IQueryable<T>, IOrderedQueryable<T>> orderBy = null,
            Func<IQueryable<T>, IIncludableQueryable<T, object>> include = null,
            int index = 0,
            int size = 20,
            bool disableTracking = true,
            CancellationToken cancellationToken = default)
        {
            IQueryable<T> query = DbSet;
            if (disableTracking)
            {
                query = query.AsNoTracking();
            }

            if (include != null)
            {
                query = include(query);
            }

            if (predicate != null)
            {
                query = query.Where(predicate);
            }

            if (orderBy != null)
            {
                return orderBy(query).ToPaginateAsync(index, size, 0, cancellationToken);
            }

            return query.ToPaginateAsync(index, size, 0, cancellationToken);
        }

        /// <inheritdoc/>
        public async Task<EntityEntry<T>> AddAsync(T entity, CancellationToken cancellationToken = default)
        {
            return await DbSet.AddAsync(entity, cancellationToken);
        }

        /// <inheritdoc/>
        public Task AddAsync(params T[] entities)
        {
            return DbSet.AddRangeAsync(entities);
        }

        /// <inheritdoc/>
        public Task AddAsync(
            IEnumerable<T> entities,
            CancellationToken cancellationToken = default)
        {
            return DbSet.AddRangeAsync(entities, cancellationToken);
        }

        /// <inheritdoc/>
        [Obsolete("Use get list ")]
        public IEnumerable<T> GetAsync(Expression<Func<T, bool>> predicate)
        {
            throw new NotImplementedException();
        }

        /// <inheritdoc/>
        public void UpdateAsync(T entity)
        {
            DbSet.Update(entity);
        }

        /// <summary>
        /// Add new record in the database.
        /// </summary>
        /// <param name="entity">The new record that will be inserted to the database.</param>
        /// <returns>A <see cref="Task"/> representing the result of the asynchronous operation.</returns>
        public Task AddAsync(T entity)
        {
            return AddAsync(entity, CancellationToken.None);
        }
    }
}
