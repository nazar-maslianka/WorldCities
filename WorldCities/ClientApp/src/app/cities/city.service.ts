import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { City } from './city';
import { map } from 'rxjs/operators';
import { AbstractControl, AsyncValidatorFn } from '@angular/forms';
import { Observable } from 'rxjs';
import { BaseService } from '../shared/services/base.service';

@Injectable({
  providedIn: 'root'
})
export class CityService 
  extends BaseService{

  url: string;
  constructor(
    http: HttpClient,
    @Inject('BASE_URL') baseUrl: string
  ) 
  {
    super(http, baseUrl)
    this.url = this.baseUrl + "api/cities/";
    
  }

  getData<City>(event: PageEvent, sort: MatSort, defaultSortColumn: string, defaultSortOrder: string, defaultFilterColumn: string, filterQuery: string) : Observable<City> {
    var params = new HttpParams()
      .set("pageIndex", event.pageIndex.toString())
      .set("pageSize", event.pageSize.toString())
      .set("sortColumn", (sort)
        ? sort.active
        : defaultSortColumn)
      .set("sortOrder", (sort)
        ? sort.direction
        : defaultSortOrder);

    if (filterQuery) {
       params = params
        .set("filterColumn", defaultFilterColumn)
        .set("filterQuery", filterQuery);
    }
    return this.http.get<any>(this.url, { params });
  }

  getCountries(){
    // fetch all the countries from the server
    var url = this.baseUrl + "api/countries";
    var params = new HttpParams()
    .set("pageSize", "9999")
    .set("sortColumn", "name");
    return this.http.get<any>(url, { params });
  }
  getById(id: number)
  {
    var urlGetById = this.url + id;
    return this.http.get<City>(urlGetById);
  }
  get<City>(id: number): Observable<City> {
    var urlGetById = this.url + id;
    return this.http.get<City>(urlGetById);
  }
  put<City>(item): Observable<City> {
    var url = this.baseUrl + "api/cities/" + item.id;
    return this.http.put<City>(url, item);
  }
  post<City>(item: City): Observable<City> {
    var url = this.baseUrl + "api/cities/";
    return this.http.post<City>(url, item);
  }
  isDupeCity(city: City) {
        var url = `${this.url}isDupeCity/`;
        return this.http.post<boolean>(url, city);
  }
}

