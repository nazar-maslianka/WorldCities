import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { City } from './city';
import { map } from 'rxjs/operators';
import { AbstractControl, AsyncValidatorFn } from '@angular/forms';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CitiesService {

  url: string;
  constructor(
    private http: HttpClient,
    @Inject('BASE_URL') private baseUrl: string
  ) 
  {
    this.url = this.baseUrl + "api/cities/";
  }

  getById(id: number)
  {
    var urlGetById = this.url + id;
    return this.http.get<City>(urlGetById);
  }

  getDataByParameters(event: PageEvent, sort: MatSort, defaultSortColumn: string, defaultSortOrder: string, defaultFilterColumn: string, filterQuery: string) {
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
 
  add(city: City) {
    var url = this.baseUrl + "api/cities/";
    return this.http.post<City>(url, city);
  }

  edit(city: City) {
    var url = this.baseUrl + "api/cities/" + city.id;
    return this.http.put<City>(url, city);
  }

  isDupeField(fieldName: string, control: AbstractControl, id?: number) {
        var params = new HttpParams()
          .set("countryId", (id) ? id.toString() : "0")
          .set("fieldName", fieldName)
          .set("fieldValue", control.value);
        var url = `${this.url}isDupeField/`;
        return this.http.post<boolean>(url, null, {params});
  }
}

