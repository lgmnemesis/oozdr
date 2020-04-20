import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { SignInComponent } from './sign-in.component';

@NgModule({
  declarations: [SignInComponent],
  exports: [SignInComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SignInModule { }