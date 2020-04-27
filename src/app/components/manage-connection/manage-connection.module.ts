import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManageConnectionComponent } from './manage-connection.component';
import { Ng2TelInputModule } from 'ng2-tel-input';

@NgModule({
  imports: [CommonModule, Ng2TelInputModule],
  declarations: [ManageConnectionComponent],
  exports: [ManageConnectionComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ManageConnectionModule { }