import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { UnsubscribePageRoutingModule } from './unsubscribe-routing.module';
import { UnsubscribePage } from './unsubscribe.page';
import { ScrollbarThemeModule } from 'src/app/directives/scrollbar-theme.directive';
import { ParallaxHeaderModule } from 'src/app/directives/parallax-header.directive';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UnsubscribePageRoutingModule,
    ScrollbarThemeModule,
    ParallaxHeaderModule
  ],
  declarations: [UnsubscribePage]
})
export class UnsubscribePageModule {}
