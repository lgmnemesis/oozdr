import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileMenuComponent } from './profile-menu.component';

@NgModule({
  imports: [CommonModule],
  declarations: [ProfileMenuComponent],
  exports: [ProfileMenuComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ProfileMenuModule { }