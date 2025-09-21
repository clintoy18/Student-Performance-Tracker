// <copyright file="IPaginate.cs" company="Alliance Software Inc">
// Copyright (c) Alliance Software Inc. All rights reserved.
// </copyright>

namespace ASI.Basecode.Data.EFCore.Paging
{
    using System;
    using System.Collections.Generic;
    using ASI.Basecode.Data.EFCore.Paging;

    public static class PaginateExtensions
    {
        public static IPaginate<T> ToPaginate<T>(this IEnumerable<T> source, int index, int size, int from = 0)
        {
            return new Paginate<T>(source, index, size, from);
        }

        public static IPaginate<TResult> ToPaginate<TSource, TResult>(
            this IEnumerable<TSource> source,
            Func<IEnumerable<TSource>,
            IEnumerable<TResult>> converter,
            int index,
            int size,
            int from = 0)
        {
            return new Paginate<TSource, TResult>(source, converter ?? null, index, size, from);
        }
    }
}
