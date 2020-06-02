import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ProfilePageRoutingModule } from './profile-routing.module';
import { ProfilePage } from './profile.page';
import { TopMenuModule } from 'src/app/components/top-menu/top-menu.module';
import { ProfileMenuModule } from 'src/app/components/profile-menu/profile-menu.module';
import { ScrollbarThemeModule } from 'src/app/directives/scrollbar-theme.directive';
import { AlertsModule } from 'src/app/components/alerts/alerts.module';
import { ParallaxHeaderModule } from 'src/app/directives/parallax-header.directive';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProfilePageRoutingModule,
    TopMenuModule,
    ProfileMenuModule,
    ScrollbarThemeModule,
    ParallaxHeaderModule,
    AlertsModule
  ],
  declarations: [ProfilePage]
})
export class ProfilePageModule {}
