import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InviteFriendsComponent } from './invite-friends.component';
import { SocialShareModule } from '../social-share/social-share.module';

@NgModule({
  imports: [CommonModule, SocialShareModule],
  declarations: [InviteFriendsComponent],
  exports: [InviteFriendsComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class InviteFriendsModule { }