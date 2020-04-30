import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { SignInComponent } from './sign-in.component';
import { PhoneLoginModule } from '../phone-login/phone-login.module';

@NgModule({
  imports: [PhoneLoginModule],
  declarations: [SignInComponent],
  exports: [SignInComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SignInModule { }