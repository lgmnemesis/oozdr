import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SiteFooterComponent } from './site-footer.component';

@NgModule({
  imports: [CommonModule],
  declarations: [SiteFooterComponent],
  exports: [SiteFooterComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SiteFooterModule { }