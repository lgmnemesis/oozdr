import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactComponent } from './contact.component';
import { ContactLinksModule } from '../contact-links/contact.module';

@NgModule({
  imports: [
    CommonModule,
    ContactLinksModule
  ],
  declarations: [ContactComponent],
  exports: [ContactComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ContactModule { }