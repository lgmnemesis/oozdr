import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManageConnectionModalComponent } from './manage-connection-modal.component';
import { ManageConnectionModule } from '../manage-connection/manage-connection.module';
import { ScrollbarThemeModule } from 'src/app/directives/scrollbar-theme.directive';
import { ParallaxHeaderModule } from 'src/app/directives/parallax-header.directive';

@NgModule({
  imports: [CommonModule, ManageConnectionModule, ScrollbarThemeModule, ParallaxHeaderModule],
  declarations: [ManageConnectionModalComponent],
  exports: [ManageConnectionModalComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ManageConnectionModalModule { }