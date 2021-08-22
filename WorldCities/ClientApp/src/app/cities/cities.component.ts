import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, Inject, ViewChild } from '@angular/core';
import { City } from './city';
import { CountryService } from '../countries/country.service';
import { MatSort } from '@angular/material/sort'
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { CityService } from './city.service'
import { AbstractControl, AsyncValidatorFn } from '@angular/forms';
import { Observable } from 'rxjs';
import { ApiResult } from '../shared/models/api-result';

@Component({
  selector: 'app-cities',
  templateUrl: './cities.component.html',
  styleUrls: ['./cities.component.css']
})
export class CitiesComponent {

  public cities: MatTableDataSource<City>;
  public displayedColumns: string[] = ['id', 'name', 'lat', 'lon', 'countryName'];

  defaultPageIndex: number = 0;
  defaultPageSize: number = 10;
  public defaultSortColumn: string = "name";
  public defaultSortOrder: string = "asc";

  defaultFilterColumn: string = "name";
  filterQuery: string = null;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private http: HttpClient,
    private citiesService: CityService) {
    this.citiesService = citiesService;
  }

  ngOnInit() {
    this.loadData(null);
  }

  loadData(query: string = null) {
    var pageEvent = new PageEvent();
    pageEvent.pageSize = this.defaultPageSize;
    pageEvent.pageIndex = this.defaultPageIndex;
    if (query) {
      this.filterQuery = query;
    }
    else if(query === "" && this.filterQuery !== null){
      this.filterQuery = null;
    }   
    this.getData(pageEvent);
  }

  getData(event: PageEvent){
    return this.citiesService.getData<ApiResult<City>>(event, this.sort, this.defaultSortColumn, this.defaultSortOrder, this.defaultFilterColumn, this.filterQuery)
        .subscribe(result => {
        this.paginator.length = result.totalItemsCount;
        this.paginator.pageSize = result.pageSize;
        this.paginator.pageIndex = result.pageIndex;
        this.cities = new MatTableDataSource<City>(result.data);
      }, error => console.error(error));
  }
}
