import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManageConnectionComponent } from './manage-connection.component';
import { Ng2TelInputModule } from 'ng2-tel-input';
import { ContactPickerModule } from '../contact-picker/contact-picker.module';

@NgModule({
  imports: [CommonModule, Ng2TelInputModule, ContactPickerModule],
  declarations: [ManageConnectionComponent],
  exports: [ManageConnectionComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ManageConnectionModule { }