import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManageConnectionModalComponent } from './manage-connection-modal.component';
import { ManageConnectionModule } from '../manage-connection/manage-connection.module';

@NgModule({
  imports: [CommonModule, ManageConnectionModule],
  declarations: [ManageConnectionModalComponent],
  exports: [ManageConnectionModalComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ManageConnectionModalModule { }