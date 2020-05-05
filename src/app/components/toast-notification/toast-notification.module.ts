import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastNotificationComponent } from './toast-notification.component';

@NgModule({
  imports: [CommonModule],
  declarations: [ToastNotificationComponent],
  exports: [ToastNotificationComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ToastNotificationModule { }