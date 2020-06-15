import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { LocaleService } from 'src/app/services/locale.service';

@Component({
  selector: 'app-invite-friends',
  templateUrl: './invite-friends.component.html',
  styleUrls: ['./invite-friends.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InviteFriendsComponent implements OnInit {

  dictionary = this.localeService.dictionary;
  dictInvite = this.dictionary.inviteFriendsComponent;
  
  constructor(private localeService: LocaleService) { }

  ngOnInit() {}

}
