import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InviteFriendsModalComponent } from './invite-friends-modal.component';
import { InviteFriendsModule } from '../invite-friends/invite-friends.module';

@NgModule({
  imports: [CommonModule, InviteFriendsModule],
  declarations: [InviteFriendsModalComponent],
  exports: [InviteFriendsModalComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class InviteFriendsModalModule { }