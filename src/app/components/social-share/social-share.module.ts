import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SocialShareComponent } from './social-share.component';

@NgModule({
  imports: [CommonModule],
  declarations: [SocialShareComponent],
  exports: [SocialShareComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SocialShareModule { }