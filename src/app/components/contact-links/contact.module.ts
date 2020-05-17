import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactLinksComponent } from './contact-links.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [ContactLinksComponent],
  exports: [ContactLinksComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ContactLinksModule { }