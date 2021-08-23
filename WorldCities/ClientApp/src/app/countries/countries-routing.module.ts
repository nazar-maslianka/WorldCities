import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CountriesComponent } from './countries.component';
import { CountryEditComponent } from './country-edit/country-edit.component';


const routes: Routes = [
  { path: 'countries', component: CountriesComponent },
  { path: "country/:id", component: CountryEditComponent },
  { path: "country", component: CountryEditComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CountriesRoutingModule { }
