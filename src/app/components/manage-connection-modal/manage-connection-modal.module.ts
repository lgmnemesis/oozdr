import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManageConnectionModalComponent } from './manage-connection-modal.component';
import { ManageConnectionModule } from '../manage-connection/manage-connection.module';
import { ScrollbarThemeModule } from 'src/app/directives/scrollbar-theme.directive';

@NgModule({
  imports: [CommonModule, ManageConnectionModule, ScrollbarThemeModule],
  declarations: [ManageConnectionModalComponent],
  exports: [ManageConnectionModalComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ManageConnectionModalModule { }