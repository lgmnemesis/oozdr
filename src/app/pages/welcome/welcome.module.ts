import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { WelcomePageRoutingModule } from './welcome-routing.module';
import { WelcomePage } from './welcome.page';
import { WelcomeContainerModule } from 'src/app/components/welcome/welcome-container/welcome-container.module';
import { ScrollbarThemeModule } from 'src/app/directives/scrollbar-theme.directive';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WelcomePageRoutingModule,
    WelcomeContainerModule,
    ScrollbarThemeModule
  ],
  declarations: [WelcomePage]
})
export class WelcomePageModule {}
