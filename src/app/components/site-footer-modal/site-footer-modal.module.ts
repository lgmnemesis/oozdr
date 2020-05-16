import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SiteFooterModalComponent } from './site-footer-modal.component';
import { SiteFooterModule } from '../site-footer/site-footer.module';

@NgModule({
  imports: [CommonModule, SiteFooterModule],
  declarations: [SiteFooterModalComponent],
  exports: [SiteFooterModalComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SiteFooterModalModule { }