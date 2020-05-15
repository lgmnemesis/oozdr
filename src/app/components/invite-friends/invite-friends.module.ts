import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InviteFriendsComponent } from './invite-friends.component';

@NgModule({
  imports: [CommonModule],
  declarations: [InviteFriendsComponent],
  exports: [InviteFriendsComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class InviteFriendsModule { }