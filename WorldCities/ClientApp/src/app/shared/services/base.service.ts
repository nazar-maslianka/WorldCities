import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Observable } from 'rxjs';
import { ApiResult } from '../models/api-result';

@Injectable({
  providedIn: 'root'
})
export abstract class BaseService {

  constructor(
    protected http: HttpClient,
    protected baseUrl: string
  ) { 
  }

  abstract getData<ApiResult>(
    args: PageEvent | string, 
    argsSort: MatSort | string, 
    defaultSortColumn?: string, 
    defaultSortOrder?: string, 
    defaultFilterColumn?: string, 
    filterQuery?: string
  ) : Observable<ApiResult>;
  
  abstract get<T>(id: number) : Observable<T>;
  abstract put<T>(item: T) : Observable<T>;
  abstract post<T>(item: T) : Observable<T>;
}
