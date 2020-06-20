import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeedbackComponent } from './feedback.component';
import { SocialShareModule } from '../social-share/social-share.module';

@NgModule({
  imports: [CommonModule, SocialShareModule],
  declarations: [FeedbackComponent],
  exports: [FeedbackComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class FeedbackModule { }