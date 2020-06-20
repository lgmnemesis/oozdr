import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeedbackModalComponent } from './feedback-modal.component';
import { FeedbackModule } from '../feedback/feedback.module';

@NgModule({
  imports: [CommonModule, FeedbackModule],
  declarations: [FeedbackModalComponent],
  exports: [FeedbackModalComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class FeedbackModalModule { }