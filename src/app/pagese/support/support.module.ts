import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SupportPageRoutingModule } from './support-routing.module';
import { SupportPage } from './support.page';
import { ScrollbarThemeModule } from 'src/app/directives/scrollbar-theme.directive';
import { ContactModule } from 'src/app/components/contact/contact.module';
import { SupportModule } from 'src/app/components/support/support.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SupportPageRoutingModule,
    ScrollbarThemeModule,
    SupportModule,
    ContactModule
  ],
  declarations: [SupportPage]
})
export class SupportPageModule {}
