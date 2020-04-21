import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HomeButtonComponent } from './home-button.component';

@NgModule({
  declarations: [HomeButtonComponent],
  exports: [HomeButtonComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HomeButtonModule { }