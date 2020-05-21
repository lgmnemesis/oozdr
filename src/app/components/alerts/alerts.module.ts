import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertsComponent } from './alerts.component';

@NgModule({
  imports: [CommonModule],
  declarations: [AlertsComponent],
  exports: [AlertsComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AlertsModule { }