// <copyright file="IPaginate.cs" company="Alliance Software Inc">
// Copyright (c) Alliance Software Inc. All rights reserved.
// </copyright>

namespace ASI.Basecode.Data.EFCore.Paging
{
    using System;
    using System.Collections.Generic;
    using System.Linq;

    public class Paginate<T> : IPaginate<T>
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="Paginate{T}"/> class.
        /// </summary>
        /// <param name="source">Source data list.</param>
        /// <param name="index">Page number of the list.</param>
        /// <param name="size">Number of records per page.</param>
        /// <param name="from">Total number of pages.</param>
        internal Paginate(IEnumerable<T> source, int index, int size, int from)
        {
            var enumerable = source as T[] ?? source.ToArray();

            if (from > index)
            {
                throw new ArgumentException($"indexFrom: {from} > pageIndex: {index}, must indexFrom <= pageIndex");
            }

            if (source is IQueryable<T> querable)
            {
                Index = index;
                Size = size;
                From = from;
                Count = querable.Count();
                Pages = (int)Math.Ceiling(Count / (double)Size);

                Items = querable.Skip((Index - From) * Size).Take(Size).ToList();
            }
            else
            {
                Index = index;
                Size = size;
                From = from;

                Count = enumerable.Length;
                Pages = (int)Math.Ceiling(Count / (double)Size);

                Items = enumerable.Skip((Index - From) * Size).Take(Size).ToList();
            }
        }

        /// <summary>
        /// Initializes a new instance of the <see cref="Paginate{T}"/> class.
        /// </summary>
        internal Paginate()
        {
            Items = Array.Empty<T>();
        }

        /// <inheritdoc/>
        public int From { get; set; }

        /// <inheritdoc/>
        public int Index { get; set; }

        /// <inheritdoc/>
        public int Size { get; set; }

        /// <inheritdoc/>
        public int Count { get; set; }

        /// <inheritdoc/>
        public int Pages { get; set; }

        /// <inheritdoc/>
        public IList<T> Items { get; set; }

        /// <inheritdoc/>
        public bool HasPrevious => Index - From > 0;

        /// <inheritdoc/>
        public bool HasNext => Index - From + 1 < Pages;
    }

    public static class Paginate
    {
        public static IPaginate<T> Empty<T>()
        {
            return new Paginate<T>();
        }

        public static IPaginate<TResult> From<TResult, TSource>(
            IPaginate<TSource> source,
            Func<IEnumerable<TSource>, IEnumerable<TResult>> converter)
        {
            return new Paginate<TSource, TResult>(source ?? null, converter ?? null);
        }
    }

    internal class Paginate<TSource, TResult> : IPaginate<TResult>
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="Paginate{TSource, TResult}"/> class.
        /// </summary>
        /// <param name="source">Source data list.</param>
        /// <param name="converter">Object Mapper.</param>
        /// <param name="index">Page number of the list.</param>
        /// <param name="size">Number of records per page.</param>
        /// <param name="from">Total number of pages.</param>
        public Paginate(
            IEnumerable<TSource> source,
            Func<IEnumerable<TSource>, IEnumerable<TResult>> converter,
            int index,
            int size,
            int from)
        {
            var enumerable = source as TSource[] ?? source.ToArray();

            if (from > index)
            {
                throw new ArgumentException($"From: {from} > Index: {index}, must From <= Index");
            }

            if (source is IQueryable<TSource> queryable)
            {
                Index = index;
                Size = size;
                From = from;
                Count = queryable.Count();
                Pages = (int)Math.Ceiling(Count / (double)Size);

                var items = queryable.Skip((Index - From) * Size).Take(Size).ToArray();

                Items = new List<TResult>(converter(items));
            }
            else
            {
                Index = index;
                Size = size;
                From = from;
                Count = enumerable.Length;
                Pages = (int)Math.Ceiling(Count / (double)Size);

                var items = enumerable.Skip((Index - From) * Size).Take(Size).ToArray();

                Items = new List<TResult>(converter(items));
            }
        }

        /// <summary>
        /// Initializes a new instance of the <see cref="Paginate{TSource, TResult}"/> class.
        /// </summary>
        /// <param name="source">Source data list.</param>
        /// <param name="converter">Object Mapper.</param>
        public Paginate(IPaginate<TSource> source, Func<IEnumerable<TSource>, IEnumerable<TResult>> converter)
        {
            Index = source.Index;
            Size = source.Size;
            From = source.From;
            Count = source.Count;
            Pages = source.Pages;

            Items = new List<TResult>(converter(source.Items));
        }

        /// <inheritdoc/>
        public int Index { get; }

        /// <inheritdoc/>
        public int Size { get; }

        /// <inheritdoc/>
        public int Count { get; }

        /// <inheritdoc/>
        public int Pages { get; }

        /// <inheritdoc/>
        public int From { get; }

        /// <inheritdoc/>
        public IList<TResult> Items { get; }

        /// <inheritdoc/>
        public bool HasPrevious => Index - From > 0;

        /// <inheritdoc/>
        public bool HasNext => Index - From + 1 < Pages;
    }
}
