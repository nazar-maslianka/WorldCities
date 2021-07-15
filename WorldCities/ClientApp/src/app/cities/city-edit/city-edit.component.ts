import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CitiesService } from '../cities.service';
import { City } from '../city';
import { Country } from '../../countries/country';

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

  isDupeCity: boolean = false;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private citiesService: CitiesService, 
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.createCityAddEditForm();
    this.loadData();
  }

  createCityAddEditForm(){
    this.form = this.fb.group({
      name: [null,
        [
          Validators.required,
          Validators.pattern('[a-zA-Z\'-\\s]{2,}')
        ]
      ],
      lat: [null,
        [
          Validators.required,
          Validators.pattern('^(-)?\\d+\\.\\d{1,4}$')
        ]
      ],
      lon: [null,
        [
          Validators.required,
          Validators.pattern('^(-)?\\d+\\.\\d{1,4}$')
        ]
      ],
      countryId: [null, 
        [
          Validators.required
        ]
      ]
    });
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
    this.city = (this.id) ? this.city : <City>{};
    this.isDuplicateCity();
    if(!this.isDupeCity)
    {
    if (this.id) {
      this.city.name = this.form.get("name").value;
      this.city.lat = this.form.get("lat").value;
      this.city.lon = this.form.get("lon").value;
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
  }
  
  isDuplicateCity() {
      var city = <City>{};
      city.id = (this.id !== undefined) ? this.id : 0;
      city.name = this.form.get("name").value;
      city.lat = this.form.get("lat").value;
      city.lon = this.form.get("lon").value;
      city.countryId = this.form.get("countryId").value;
    
      this.citiesService.isDupeCity(city).subscribe(result => {
        this.isDupeCity = result ? true : false;
      });
  }
}
