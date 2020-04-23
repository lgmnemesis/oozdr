import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WelcomeInfoComponent } from './welcome-info.component';

@NgModule({
  imports: [CommonModule],
  declarations: [WelcomeInfoComponent],
  exports: [WelcomeInfoComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class WelcomeInfoModule { }