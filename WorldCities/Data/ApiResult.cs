﻿using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Linq.Dynamic.Core;
using System.Reflection;
using WorldCities.Data.Helpers;

namespace WorldCities.Data
{
    public class ApiResult <T>
    {
        /// <summary>
        /// Private constructor called by the CreateAsync method.
        /// </summary>
        private ApiResult(
            List<T> data, 
            int count,
            int pageIndex,
            int pageSize,
            string sortColumn,
            string sortOrder,
            string filterColumn,
            string filterQuery)
        {
            Data = data;
            PageSize = pageSize;
            PageIndex = pageIndex;
            TotalPages = (int)Math.Ceiling(count / (double) pageSize);
            TotalItemsCount = count;
            SortColumn = sortColumn;
            SortOrder = sortOrder;
            FilterColumn = filterColumn;
            FilterQuery = filterQuery;
        }

        #region Methods
        /// <summary>
        /// Pages, sorts and/or filters a IQueryable source.
        /// </summary>
        /// <param name="source">An IQueryable source of generic
        /// type</param>
        /// <param name="pageIndex">Zero-based current page index
        /// (0 = first page)</param>
        /// <param name="pageSize">The actual size of each
        /// page</param>
        /// <param name="sortColumn">The sorting column name
        /// </param>
        /// <param name="sortOrder">The sorting order ("ASC" or
        /// "DESC")</param>
        /// <param name="filterColumn">The filtering column
        /// name</param>
        /// <param name="filterQuery">The filtering query (value to
        /// lookup)</param>

        /// <returns>
        /// A object containing the IQueryable paged/sorted/filtered
        /// result
        /// and all the relevant paging/sorting/filtering navigation
        /// info.
        /// </returns>
        public static async Task<ApiResult<T>> CreateAsync(
            IQueryable<T> source,
            int pageIndex,
            int pageSize,
            string sortColumn,
            string sortOrder,
            string filterColumn,
            string filterQuery) 
        {
            if (!string.IsNullOrEmpty(filterQuery)
            && !string.IsNullOrEmpty(filterColumn)
            && IsValidProperty(filterColumn))
            {
                source = source.Where(
                    string.Format("{0}.Contains(@0)",
                    filterColumn),
                    filterQuery);
            }

            var count = await source.CountAsync();

            if (!string.IsNullOrEmpty(sortColumn) 
                && IsValidProperty(sortColumn))
            {
                sortOrder = !string.IsNullOrEmpty(sortOrder)
                    && sortOrder.ToUpper() == "ASC"
                    ? "ASC"
                    : "DESC";
                source = source.OrderBy(
                    string.Format("{0} {1}", 
                    sortColumn,
                    sortOrder)
                    );
            }

            source = source
                .Skip(pageIndex * pageSize)
                .Take(pageSize);

            #if DEBUG
            {
                var sql = source.ToSql();
            }
            #endif

            var data = await source.ToListAsync();
            return new ApiResult<T>(
                data,
                count,
                pageIndex,
                pageSize,
                sortColumn,
                sortOrder,
                filterColumn,
                filterQuery);
        }

        public static bool IsValidProperty(
            string propertyName,
            bool throwExceptionNotFound = true)
        {
            var prop = typeof(T).GetProperty(
                propertyName,
                BindingFlags.IgnoreCase |
                BindingFlags.Public |
                BindingFlags.Instance);

            if (prop == null && throwExceptionNotFound)
            {
                throw new NotSupportedException(
                    String.Format(
                        "Error: Property '{0}' does not exist.", 
                        propertyName)
                    );
            }

            return prop != null;
        }
#endregion

#region Properties
        /// <summary>
        /// The data result
        /// </summary>
        public List<T> Data { get; private set; }

        /// <summary>
        /// Zero-based index of current page
        /// </summary>
        public int PageIndex { get; private set; }

        /// <summary>
        /// Number of of items in each page
        /// </summary>
        public int PageSize { get; private set; }

        /// <summary>
        /// Total pages count
        /// </summary>
        public int TotalPages { get; private set; }
        
        /// <summary>
        /// Total items count
        /// </summary>
        public int TotalItemsCount { get; private set; }

        /// <summary>
        /// TRUE if the current page has a previous page, FALSE otherwise.
        /// </summary>
        public bool HasPreviousPage
        {
            get { return PageIndex  > 0; }
        }

        /// <summary>
        /// TRUE if the current page has a next page, FALSE otherwise.
        /// </summary>
        public bool HasNextPage 
        {
            get { return (PageIndex + 1)  < TotalPages; }
        }

        /// <summary>
        /// Sorting column name (or null if none set)
        /// </summary>
        public string SortColumn { get; set; }

        /// <summary>
        /// Sorting order ("ASC", "DESC" or null if none set)
        /// </summary>
        public string SortOrder { get; set; }

        /// <summary>
        /// Filter Column name (or null if none set)
        /// </summary>
        public string FilterColumn { get; set; }

        /// <summary>
        /// Filter Query string
        /// (to be used within the given FilterColumn)
        /// </summary>
        public string FilterQuery { get; set; }
#endregion
    }
}
