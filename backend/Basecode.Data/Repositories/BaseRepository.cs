using Basecode.Data;
using Basecode.Data.EFCore;
using Basecode.Data.EFCore.Paging;
using Basecode.Data.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Query;
using System;
using System.Linq.Expressions;
using System.Linq;

namespace Basecode.Data.Repositories
{
    public class BaseRepository<T> : IReadRepository<T>
        where T : class
    {
        private DbContext context;

        protected IUnitOfWork UnitOfWork { get; set; }

        protected BasecodeDbContext Context => (BasecodeDbContext)UnitOfWork.Database;

        public BaseRepository(IUnitOfWork unitOfWork)
        {
            if (unitOfWork == null) throw new ArgumentNullException(nameof(unitOfWork));
            UnitOfWork = unitOfWork;
        }

        public BaseRepository(DbContext context)
        {
            this.context = context;
        }

        protected virtual DbSet<TEntity> GetDbSet<TEntity>() where TEntity : class
        {
            return Context.Set<TEntity>();
        }

        protected DbContext DbContext { get; }

        protected DbSet<T> DbSet { get; }

        protected virtual void SetEntityState(object entity, EntityState entityState)
        {
            Context.Entry(entity).State = entityState;
        }

        /// <summary>
        /// Filters a sequence of values based on a predicate. This method is no-tracking query.
        /// </summary>
        /// <param name="predicate">A function to test each element for a condition.</param>
        /// <returns>An <see cref="IQueryable{T}" /> that contains elements that satisfy the condition specified by predicate.</returns>
        /// <remarks>This method is no-tracking query.</remarks>
        public IQueryable<T> Query(Expression<Func<T, bool>> predicate) => DbSet.AsNoTracking().Where(predicate);

        /// <summary>
        /// Filters a sequence of values based on a predicate. This method will change tracking by context.
        /// </summary>
        /// <param name="predicate">A function to test each element for a condition.</param>
        /// <returns>An <see cref="IQueryable{TEntity}" /> that contains elements that satisfy the condition specified by predicate.</returns>
        /// <remarks>This method will change tracking by context.</remarks>
        public IQueryable<T> Where(Expression<Func<T, bool>> predicate) => DbSet.Where(predicate);

        /// <summary>
        /// Uses raw SQL queries to fetch the specified <typeparamref name="T" /> data.
        /// </summary>
        /// <param name="sql">The raw SQL.</param>
        /// <param name="parameters">The parameters.</param>
        /// <returns>An <see cref="IQueryable{T}" /> that contains elements that satisfy the condition specified by raw SQL.</returns>
        public IQueryable<T> FromSql(string sql, params object[] parameters) => DbSet.FromSqlRaw(sql, parameters);

        /// <inheritdoc/>
        public T Search(params object[] keyValues)
        {
            return DbSet.Find(keyValues);
        }

        /// <inheritdoc/>
        public T SingleEntity(
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
                return orderBy(query).FirstOrDefault();
            }

            return query.FirstOrDefault();
        }

        /// <inheritdoc/>
        public IPaginate<T> GetList(
            Expression<Func<T, bool>> predicate = null,
            Func<IQueryable<T>, IOrderedQueryable<T>> orderBy = null,
            Func<IQueryable<T>, IIncludableQueryable<T, object>> include = null,
            int index = 0,
            int size = 20,
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

            return orderBy != null ? orderBy(query).ToPaginate(index, size) : query.ToPaginate(index, size);
        }

        /// <inheritdoc/>
        public IPaginate<TResult> GetList<TResult>(
            Expression<Func<T, TResult>> selector,
            Expression<Func<T, bool>> predicate = null,
            Func<IQueryable<T>, IOrderedQueryable<T>> orderBy = null,
            Func<IQueryable<T>, IIncludableQueryable<T, object>> include = null,
            int index = 0,
            int size = 20,
            bool disableTracking = true)
            where TResult : class
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

            return orderBy != null
                ? orderBy(query).Select(selector).ToPaginate(index, size)
                : query.Select(selector).ToPaginate(index, size);
        }

        public void Dispose()
        {
            DbContext?.Dispose();
        }
    }
}
