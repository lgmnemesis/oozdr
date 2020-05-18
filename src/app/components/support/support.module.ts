import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SupportComponent } from './support.component';

@NgModule({
  imports: [CommonModule],
  declarations: [SupportComponent],
  exports: [SupportComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SupportModule { }