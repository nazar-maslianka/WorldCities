export interface ApiResult<T> {
    data: T[];
    pageIndex: number;
    pageSize: number;
    totalItemsCount: number;
    totalPages: number;
    sortColumn: string;
    sortOrder: string;
    filterColumn: string;
    filterQuery: string;
}