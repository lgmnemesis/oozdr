import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { PrivacyPageRoutingModule } from './privacy-routing.module';
import { PrivacyPage } from './privacy.page';
import { ScrollbarThemeModule } from 'src/app/directives/scrollbar-theme.directive';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PrivacyPageRoutingModule,
    ScrollbarThemeModule
  ],
  declarations: [PrivacyPage]
})
export class PrivacyPageModule {}
