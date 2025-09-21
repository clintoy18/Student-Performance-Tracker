using System;
using ASI.Basecode.Data.EFCore;
using System.Collections.Generic;
using ASI.Basecode.Data.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;
using Microsoft.IdentityModel.Tokens;
using Basecode.Data.Repositories;
using System.Reflection;

namespace ASI.Basecode.Data.EFCore
{
    public class Repository<T> : BaseRepository<T>, IRepository<T>
        where T : class
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="Repository{T}"/> class.
        /// </summary>
        /// <param name="context">Database context that will holds the connection to the database.</param>
        public Repository(DbContext context)
            : base(context)
        {
        }

        /// <inheritdoc/>
        public T GetByID(int id)
        {
            return DbSet.Find(id);
        }

        /// <inheritdoc/>
        public T Add(T entity)
        {
            return DbSet.Add(entity).Entity;
        }

        /// <inheritdoc/>
        public void Add(params T[] entities)
        {
            DbSet.AddRange(entities);
        }

        /// <inheritdoc/>
        public void Add(IEnumerable<T> entities)
        {
            DbSet.AddRange(entities);
        }

        /// <inheritdoc/>
        public void Delete(T entity)
        {
            //var existing = DbSet.Find(entity);
            //if (existing != null)
            //{
            //    DbSet.Remove(existing);
            //}
            DbSet.Remove(entity);
        }

        /// <inheritdoc/>
        public void Delete(object id)
        {
            var typeInfo = typeof(T).GetTypeInfo();
            var key = DbContext.Model.FindEntityType(typeInfo)
                                     .FindPrimaryKey().Properties;
            var property = typeInfo.GetProperty(key?[0].Name);
            if (property != null)
            {
                var entity = Activator.CreateInstance<T>();
                property.SetValue(entity, id);
                DbContext.Entry(entity).State = EntityState.Deleted;
            }
            else
            {
                var entity = DbSet.Find(id);
                if (entity != null)
                {
                    Delete(entity);
                }
            }
        }

        /// <inheritdoc/>
        public void Delete(params T[] entities)
        {
            DbSet.RemoveRange(entities);
        }

        /// <inheritdoc/>
        public void Delete(IEnumerable<T> entities)
        {
            DbSet.RemoveRange(entities);
        }

        /// <inheritdoc/>
        public void Update(T entity)
        {
            DbSet.Update(entity);
        }

        /// <inheritdoc/>
        public void Update(params T[] entities)
        {
            DbSet.UpdateRange(entities);
        }

        /// <inheritdoc/>
        public void Update(IEnumerable<T> entities)
        {
            DbSet.UpdateRange(entities);
        }
    }
}
