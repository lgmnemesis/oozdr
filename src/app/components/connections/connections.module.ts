import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConnectionsComponent } from './connections.component';
import { ConnectionModule } from '../connection/connection.module';
import { ManageConnectionModule } from '../manage-connection/manage-connection.module';
import { ToastNotificationModule } from '../toast-notification/toast-notification.module';

@NgModule({
  imports: [
    CommonModule,
    ConnectionModule, 
    ManageConnectionModule,
    ToastNotificationModule
  ],
  declarations: [ConnectionsComponent],
  exports: [ConnectionsComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ConnectionsModule { }