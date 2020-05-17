import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ContactPageRoutingModule } from './contact-routing.module';
import { ContactPage } from './contact.page';
import { ScrollbarThemeModule } from 'src/app/directives/scrollbar-theme.directive';
import { ContactModule } from 'src/app/components/contact/contact.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ContactPageRoutingModule,
    ScrollbarThemeModule,
    ContactModule
  ],
  declarations: [ContactPage]
})
export class ContactPageModule {}
