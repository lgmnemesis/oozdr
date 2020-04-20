import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { SignInModalComponent } from './sign-in-modal.component';
import { SignInModule } from '../sign-in/sign-in.module';

@NgModule({
  imports: [SignInModule],
  declarations: [SignInModalComponent],
  exports: [SignInModalComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SignInModalModule { }