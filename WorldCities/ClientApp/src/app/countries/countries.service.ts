import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject, Injectable, Type } from '@angular/core';
import { Constructor } from '@angular/material/core/common-behaviors/constructor';
import { PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { type } from 'os';
import { isNumber, isObject, isString } from 'util';

@Injectable({
  providedIn: 'root'
})
export class CountriesService {

  url: string;
  constructor(
    private http: HttpClient,
    @Inject('BASE_URL') private baseUrl: string
  )
  {
    this.url = this.baseUrl + 'api/countries';
  }

  public getData(pageSize: string, sortColumn: string);
  public getData(event: PageEvent, sort: MatSort, defaultSortColumn: string, defaultSortOrder: string, defaultFilterColumn: string, filterQuery: string);

  public getData(args: PageEvent | string, argsSort: MatSort | string, defaultSortColumn?: string, defaultSortOrder?: string, defaultFilterColumn?: string, filterQuery?: string) {
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
   
    return this.http.get<any>(this.url, { params });
  }
}