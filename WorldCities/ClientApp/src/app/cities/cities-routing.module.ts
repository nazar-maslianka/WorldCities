import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CitiesComponent } from './cities.component';
import { CityEditComponent } from './city-edit/city-edit.component';


const routes: Routes = [
  { path: 'cities', component: CitiesComponent },
  { path: "city/:id", component: CityEditComponent },
  { path: "city", component: CityEditComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CitiesRoutingModule { }
