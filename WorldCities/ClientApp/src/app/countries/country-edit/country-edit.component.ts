import { HttpParams } from '@angular/common/http';
import { Component, HostListener, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CountryService } from '../country.service';
import { Country } from '../country';

@Component({
  selector: 'app-country-edit',
  templateUrl: './country-edit.component.html',
  styleUrls: ['./country-edit.component.css']
})
export class CountryEditComponent {

  //the view title
  title: string;

  //the form model
  form: FormGroup;

  //the country object to edit or create
  country: Country;

  //the unique id of country, as fetched from the active route;
  // It's NULL when we're adding a new city,
  // and not NULL when we're editing an existing one.
  id? : number;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private countriesService: CountryService 
  ) { }

  ngOnInit(): void {
    this.createCountryAddEditForm();
    this.loadData();
  }

  loadData(){
    this.id = +this.activatedRoute.snapshot.paramMap.get('id');
    if (this.id)
    {
        this.countriesService.get<Country>(this.id).subscribe(country => 
        {
          this.country = country;  
          this.title = `Edit - ${country.name}`
          this.form.patchValue(country);
        }, error => console.error(error));
    }
    else{
      this.title = `Create a new Country`
    }
  }

  onSubmit() {
    this.country = (this.id) ? this.country : <Country>{};
   
    this.country.name = this.form.get("name").value;
    this.country.iso2 = this.form.get("iso2").value;
    this.country.iso3 = this.form.get("iso3").value;
    if (this.id) {
      this.countriesService.put<Country>(this.country).subscribe(result => {
        console.log("Country " + this.country.id + " has been updated");
        this.router.navigate(["/countries"]);
      }, error => console.error(error));
    }

    else
      {
        this.countriesService.post<Country>(this.country).subscribe(result => {
          console.log("Country " + result.id + " has been added");
          this.router.navigate(["/countries"]);
        }, error => console.error(error));
      }
    
  }

  createCountryAddEditForm(){
    this.form = this.fb.group({
        name:[null,
          [
            Validators.required,
            Validators.pattern("[a-zA-Z\‘-\\s]{3,}")
          ],
        ],
        iso2:[null,
          [
            Validators.required,
            Validators.pattern("[A-Z]{2}")
          ]
        ],
        iso3:[null,
          [
            Validators.required,
            Validators.pattern("[A-Z]{3}")
          ]
        ]
    })
  }

  isDupeField(field: any){
    if(field !== null)
    {
      var fieldName = field.currentTarget.attributes.formcontrolname.nodeValue;
      this.countriesService.isDupeField(fieldName, field.target.value, this.id).subscribe(result =>{
        if (result)
        {
          this.form.get(fieldName).setErrors({'isDupedField': true}); 
        }
      });
    }
   }
}
