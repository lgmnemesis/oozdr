import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SettingsPageRoutingModule } from './settings-routing.module';
import { SettingsPage } from './settings.page';
import { ScrollbarThemeModule } from 'src/app/directives/scrollbar-theme.directive';
import { InviteFriendsModalModule } from 'src/app/components/invite-friends-modal/invite-friends-modal.module';
import { ParallaxHeaderModule } from 'src/app/directives/parallax-header.directive';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SettingsPageRoutingModule,
    ScrollbarThemeModule,
    ParallaxHeaderModule,
    InviteFriendsModalModule
  ],
  declarations: [SettingsPage]
})
export class SettingsPageModule {}
