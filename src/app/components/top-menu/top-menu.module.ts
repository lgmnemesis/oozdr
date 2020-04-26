import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TopMenuComponent } from './top-menu.component';

@NgModule({
  imports: [CommonModule],
  declarations: [TopMenuComponent],
  exports: [TopMenuComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TopMenuModule { }