using System;
using System.Collections.Generic;

namespace ASI.Basecode.Data.EFCore
{
    public interface IRepository<T> : IReadRepository<T>, IDisposable
        where T : class
    {
        T GetByID(int id);

        T Add(T entity);

        void Add(params T[] entities);

        void Add(IEnumerable<T> entities);

        void Delete(T entity);

        void Delete(object id);

        void Delete(params T[] entities);

        void Delete(IEnumerable<T> entities);

        void Update(T entity);

        void Update(params T[] entities);

        void Update(IEnumerable<T> entities);
    }
}
