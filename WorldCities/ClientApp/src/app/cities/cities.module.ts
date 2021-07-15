import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularMaterialModule } from '../angular-material.module';

import { CitiesRoutingModule } from './cities-routing.module';
import { CitiesComponent } from './cities.component';
import { CityEditComponent } from './city-edit/city-edit.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [CitiesComponent, CityEditComponent],
  imports: [
    AngularMaterialModule,
    CommonModule,
    CitiesRoutingModule,
    SharedModule
  ]
})
export class CitiesModule { }
