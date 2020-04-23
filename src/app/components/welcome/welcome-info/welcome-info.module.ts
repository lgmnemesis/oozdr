import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { WelcomeInfoComponent } from './welcome-info.component';

@NgModule({
  declarations: [WelcomeInfoComponent],
  exports: [WelcomeInfoComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class WelcomeInfoModule { }