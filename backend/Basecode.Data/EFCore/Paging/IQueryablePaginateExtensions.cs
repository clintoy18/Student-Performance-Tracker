// <copyright file="IPaginate.cs" company="Alliance Software Inc">
// Copyright (c) Alliance Software Inc. All rights reserved.
// </copyright>

namespace Basecode.Data.EFCore.Paging
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;
    using System.Threading;
    using Basecode.Data.EFCore.Paging;
    using Microsoft.EntityFrameworkCore;

    public static class IQueryablePaginateExtensions
    {
        /// <summary>
        /// Represents a paginated list.
        /// </summary>
        /// <typeparam name="T">represents and entity.</typeparam>
        /// <param name="source">Source data list.</param>
        /// <param name="index">Page number retrieved.</param>
        /// <param name="size">Number of records per page.</param>
        /// <param name="from">Total number of pages.</param>
        /// <param name="cancellationToken">Cancellation notification.</param>
        /// <returns>A <see cref="Task{TResult}"/> representing the result of the asynchronous operation.</returns>
        public static async Task<IPaginate<T>> ToPaginateAsync<T>(
            this IQueryable<T> source,
            int index,
            int size,
            int from = 0,
            CancellationToken cancellationToken = default)
        {
            if (from > index)
            {
                throw new ArgumentException($"From: {from} > Index: {index}, must From <= Index");
            }

            var count = await source.CountAsync(cancellationToken).ConfigureAwait(false);
            var items = await source.Skip((index - from) * size)
                .Take(size).ToListAsync(cancellationToken).ConfigureAwait(false);

            var list = new Paginate<T>
            {
                Index = index,
                Size = size,
                From = from,
                Count = count,
                Items = items,
                Pages = (int)Math.Ceiling(count / (double)size),
            };

            return list;
        }
    }
}
