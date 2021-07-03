import { NgModule } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

@NgModule({
  imports: [
    MatSortModule,
    MatTableModule,
    MatInputModule,
    MatSelectModule,
    MatPaginatorModule
  ],
  exports: [
    MatSortModule,
    MatTableModule,
    MatInputModule,
    MatSelectModule,
    MatPaginatorModule
  ]
})
export class AngularMaterialModule { }
