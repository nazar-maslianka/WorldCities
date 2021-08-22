import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject, Injectable, Type } from '@angular/core';
import { Constructor } from '@angular/material/core/common-behaviors/constructor';
import { PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { type } from 'os';
import { Observable } from 'rxjs';
import { BaseService } from '../shared/services/base.service';
import { Country } from './country';

@Injectable({
  providedIn: 'root'
})
export class CountryService
  extends BaseService{

  url: string;
  constructor(
    http: HttpClient,
    @Inject('BASE_URL') baseUrl: string
  )
  {
    super(http, baseUrl);
    this.url = this.baseUrl + 'api/countries/';
  }

  getData<ApiResult>(pageSize: string, sortColumn: string) : Observable<ApiResult>;
  getData<ApiResult>(event: PageEvent, sort: MatSort, defaultSortColumn: string, defaultSortOrder: string, defaultFilterColumn: string, filterQuery: string) : Observable<ApiResult>;

  getData<ApiResult>(args: PageEvent | string, argsSort: MatSort | string, defaultSortColumn?: string, defaultSortOrder?: string, defaultFilterColumn?: string, filterQuery?: string): Observable<ApiResult> {
    var params = new HttpParams();
    switch (typeof(args)) {
      case 'object':
        var argPageEvent = args as PageEvent;
        params = params
          .set("pageIndex", argPageEvent.pageIndex.toString())
          .set("pageSize", argPageEvent.pageSize.toString());
        break;
      case 'string':
        params = params
          .set("pageSize", args as string);
        break;
    }
    switch (typeof(argsSort)) {
     case 'object':
       var objName = argsSort.constructor.name; 
        if (objName == "MatSort" && defaultSortOrder && defaultSortColumn){
          var argMatSort = argsSort as MatSort;
          params = params
            .set("sortColumn", (argMatSort)
              ? argMatSort.active
              : defaultSortColumn)
            .set("sortOrder", (argsSort)
              ? argMatSort.direction
              : defaultSortOrder);
        }
           break;
      case 'string':
        params = params
          .set("sortColumn", argsSort as string);
        break;
    }

    if (defaultFilterColumn && filterQuery) {
      params = params
        .set("filterColumn", defaultFilterColumn)
        .set("filterQuery", filterQuery);
    }
   
    return this.http.get<ApiResult>(this.url, { params });;
  }

  get<Country>(id: number): Observable<Country> {
    var urlGetById = this.url + id;
    return this.http.get<Country>(urlGetById);
  }

  put<Country>(item): Observable<Country> {
    var url = this.url + `${item.id}`;
    return this.http.put<Country>(url, item);
  }
  post<Country>(item): Observable<Country> {
    return this.http.post<Country>(this.url, item);
  }

  isDupeField(name: string, value: string, id?: number)
  {
    var url = `${this.url}isDupeField/`;
    var params = new HttpParams()
      .set("countryId", id ? id.toString() : "0")
      .set("fieldName", name)
      .set("fieldValue", value)

    return this.http.post<boolean>(url, null, {params});
  }
}