import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WelcomeMobileVerificationComponent } from './welcome-mobile-verification.component';

@NgModule({
  imports: [CommonModule],
  declarations: [WelcomeMobileVerificationComponent],
  exports: [WelcomeMobileVerificationComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class WelcomeMobileVerificationModule { }