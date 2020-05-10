import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TermsPageRoutingModule } from './terms-routing.module';
import { TermsPage } from './terms.page';
import { ScrollbarThemeModule } from 'src/app/directives/scrollbar-theme.directive';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TermsPageRoutingModule,
    ScrollbarThemeModule
  ],
  declarations: [TermsPage]
})
export class TermsPageModule {}
