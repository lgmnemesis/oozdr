import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PhoneLoginComponent } from './phone-login.component';
import { Ng2TelInputModule } from 'ng2-tel-input';

@NgModule({
  imports: [CommonModule, Ng2TelInputModule],
  declarations: [PhoneLoginComponent],
  exports: [PhoneLoginComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PhoneLoginModule { }