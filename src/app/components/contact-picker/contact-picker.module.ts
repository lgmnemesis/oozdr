import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactPickerComponent } from './contact-picker.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [ContactPickerComponent],
  exports: [ContactPickerComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ContactPickerModule { }