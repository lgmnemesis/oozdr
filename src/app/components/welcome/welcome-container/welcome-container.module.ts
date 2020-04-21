import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { WelcomeContainerComponent } from './welcome-container.component';

@NgModule({
  declarations: [WelcomeContainerComponent],
  exports: [WelcomeContainerComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class WelcomeContainerModule { }