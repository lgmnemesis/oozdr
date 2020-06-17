import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { SignInComponent } from './sign-in.component';
import { PhoneLoginModule } from '../phone-login/phone-login.module';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [CommonModule, PhoneLoginModule],
  declarations: [SignInComponent],
  exports: [SignInComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SignInModule { }