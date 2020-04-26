import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';

@NgModule({
  imports: [CommonModule],
  declarations: [DashboardComponent],
  exports: [DashboardComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class DashboardModule { }