import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConnectionComponent } from './connection.component';

@NgModule({
  imports: [CommonModule],
  declarations: [ConnectionComponent],
  exports: [ConnectionComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ConnectionModule { }