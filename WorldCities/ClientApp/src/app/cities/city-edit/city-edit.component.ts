import { Component, OnInit } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { error } from 'protractor';
import { CitiesService } from '../cities.service';
import { City } from '../city';
import { Country } from '../../countries/country';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-city-edit',
  templateUrl: './city-edit.component.html',
  styleUrls: ['./city-edit.component.css']
})
export class CityEditComponent {

  //the view title
  title: string;
  // the form model
  form: FormGroup;
  // the city object to edit or create
  city: City;
  // the countries array for the select
  countries: Country[];
  // the city object id, as fetched from the active route:
  // It's NULL when we're adding a new city,
  // and not NULL when we're editing an existing one.
  id?: number;

  //isDupeCity: boolean;
  constructor(
    private router: Router,
    private fb: FormBuilder,
    private citiesService: CitiesService, 
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      name: ['',
        Validators.required,
        this.isDupeField("name")
      ],
      lat: ['',
        [
        Validators.required
        ],
        this.isDupeField("lat")
      ],
      lon: ['',
        [
        Validators.required
        ],
        this.isDupeField("lon")
      ],
      countryId: ['', Validators.required]

    });

    this.loadData();
  }

  loadData() {
    //load  countries
    this.loadCountries();
    
    // retrieve the ID from the 'id' parameter
    this.id = +this.activatedRoute.snapshot.paramMap.get('id');

    if (this.id) {
      //fetch the city from the server
      this.citiesService.getById(this.id).subscribe(result => {
        this.city = result;
        this.title = "Edit - " + this.city.name;

        //update the form with the city value
        this.form.patchValue(this.city);
      }, error => console.error(error));
    }
    else 
    {
      this.title = "Create a new City";
    }
  }

  loadCountries() {
    //fetch all countries from the server
    this.citiesService.getCountries().subscribe(result => {
      this.countries = result.data;
    }, error => console.error(error));

  }

  onSubmit() {
    var city = (this.id) ? this.city : <City>{};

    if (this.id) {
      this.city.name = this.form.get("name").value;
      this.city.lat = this.form.get("lat").value;
      this.city.lon = this.form.get("lat").value;
      this.city.countryId = this.form.get("countryId").value;

      this.citiesService.edit(this.city).subscribe(result => {
        console.log("City " + this.city.id + " has been updated");
        this.router.navigate(["/cities"]);
      }, error => console.error(error));
    }

    else
    {
      this.citiesService.add(this.city).subscribe(result => {
        console.log("City " + result.id + " has been added");
        this.router.navigate(["/cities"]);
      }, error => console.error(error));
    }
  }

  isDupeField(fieldName: string): ValidatorFn {
    return (control: AbstractControl): Observable<{ [key: string]: any
    } | null> => {
      return this.citiesService.isDupeField(fieldName, control, this.id).pipe(map(result => {
        return result ? { isDupeField: true } : null;
      })) 
    }
  }
}
