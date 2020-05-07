import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileMenuComponent } from './profile-menu.component';
import { WelcomeInfoModule } from '../welcome/welcome-info/welcome-info.module';

@NgModule({
  imports: [CommonModule, WelcomeInfoModule],
  declarations: [ProfileMenuComponent],
  exports: [ProfileMenuComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ProfileMenuModule { }