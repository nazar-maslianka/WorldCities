import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AngularMaterialModule } from '../angular-material.module';
import { CountriesRoutingModule } from './countries-routing.module';
import { SharedModule } from '../shared/shared.module';
import { CountriesComponent } from './countries.component';
import { CountryEditComponent } from './country-edit/country-edit.component';


@NgModule({
  declarations: [CountriesComponent, CountryEditComponent],
  imports: [
    CommonModule,
    SharedModule, 
    AngularMaterialModule, 
    CountriesRoutingModule
  ]
})
export class CountriesModule { }
