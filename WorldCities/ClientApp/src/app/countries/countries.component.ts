import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { error } from 'protractor';
import { ApiResult } from '../shared/models/api-result';
import { CountryService } from './country.service';
import { Country } from './country';

@Component({
  selector: 'app-countries',
  templateUrl: './countries.component.html',
  styleUrls: ['./countries.component.css']
})
export class CountriesComponent implements OnInit {

  public countries: MatTableDataSource<Country>;
  public displayedColumns: string[] = ["id", "name", "iso2", "iso3", 'totCities'];

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
    private countriesService: CountryService) {
    this.countriesService = countriesService;
  }

  ngOnInit() {
    this.loadData(null);
  }

  loadData(query: string = null)
  {
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
    var res = this.countriesService.getData<ApiResult<Country>>(event, this.sort, this.defaultSortColumn, this.defaultSortOrder, this.defaultFilterColumn, this.filterQuery)
      .subscribe(result => {
        this.paginator.length = result.totalItemsCount;
        this.paginator.pageSize = result.pageSize;
        this.paginator.pageIndex = result.pageIndex;
        this.countries = new MatTableDataSource<Country>(result.data);
    }, error => console.error(error))
    return res;
  }
}
