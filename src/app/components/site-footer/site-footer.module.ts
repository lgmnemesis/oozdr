import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SiteFooterComponent } from './site-footer.component';
import { ContactLinksModule } from '../contact-links/contact.module';

@NgModule({
  imports: [CommonModule, ContactLinksModule],
  declarations: [SiteFooterComponent],
  exports: [SiteFooterComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SiteFooterModule { }