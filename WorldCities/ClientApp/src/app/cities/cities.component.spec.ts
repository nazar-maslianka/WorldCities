import { async, ComponentFixture, TestBed } from
 '@angular/core/testing';
import { BrowserAnimationsModule } from
 '@angular/platform-browser/animations';
import { AngularMaterialModule } from '../angular-material.module';
import { of } from 'rxjs';
import { City } from './city';
import { CityService } from './city.service';
import { CitiesComponent } from '../../app/cities/cities.component';
import { ApiResult } from '../shared/models/api-result';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import {HttpClientModule} from '@angular/common/http';

describe('CitiesComponent', () => {
    let fixture: ComponentFixture<CitiesComponent>;
    let component : CitiesComponent;

    //async beforeEach(): testBed initialization
    beforeEach(async(() => {
        
        let cityService = jasmine.createSpyObj<CityService>('CityService', ['getData']);

        //Configure the 'getData' spy method

        cityService.getData.and.returnValue(
            // return an Observable with some test data
            of<ApiResult<City>>(<ApiResult<City>>{
                data: [
                    <City>{
                        name : 'TestCity1',
                        id: 1, lat : 1, lon : 1,
                        countryId: 1, countryName: 'TestCountry1'
                    },
                    <City>{
                        name : 'TestCity2',
                        id: 2, lat : 2, lon : 2,
                        countryId: 2, countryName: 'TestCountry2'
                    },
                    <City>{
                        name : 'TestCity3',
                        id: 3, lat : 3, lon : 3,
                        countryId: 3, countryName: 'TestCountry3'
                    }
                ],
                totalItemsCount : 3,
                pageIndex : 0,
                pageSize : 10
            })
        );
        TestBed.configureTestingModule({
            declarations: [CitiesComponent],
            imports: [
                HttpClientTestingModule,
                BrowserAnimationsModule,
                AngularMaterialModule
            ],
            providers: [
                {
                    provide : CityService,
                    useValue : cityService
                }
            ]
        })
        .compileComponents();
    }));

    // synchronous beforeEach(): fixtures and components setup
    beforeEach( () => {
        fixture = TestBed.createComponent(CitiesComponent);
        component = fixture.componentInstance;

        component.paginator = jasmine.createSpyObj(
            "MatPaginator", ["length", "pageIndex", "pageSize"]
        );
        fixture.detectChanges();
    });

    it('should display a "Cities" title', async(() => {
        let title = fixture.nativeElement
            .querySelector('h1');
        expect (title.textContent).toEqual('Cities');
    }));

    it('should contain a table with a list of one or more cities', async( () => {
        let table = fixture.nativeElement
            .querySelector('table.mat-table');
        let tableRows = table
            .querySelectorAll('tr.mat-row');
        expect(tableRows.length).toBeGreaterThan(0);
    }));
});