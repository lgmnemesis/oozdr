import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PhoneLoginComponent } from './phone-login.component';

@NgModule({
  imports: [CommonModule],
  declarations: [PhoneLoginComponent],
  exports: [PhoneLoginComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PhoneLoginModule { }