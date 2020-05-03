import { Component, OnInit, Input } from '@angular/core';
import { Match } from 'src/app/interfaces/profile';

@Component({
  selector: 'app-chat-content-view',
  templateUrl: './chat-content-view.component.html',
  styleUrls: ['./chat-content-view.component.scss'],
})
export class ChatContentViewComponent implements OnInit {

  @Input() myUserId = 'moshe_id';
  @Input() match: Match = null;

  showUser = false;
  timeInABottle = {};

  constructor() { }

  ngOnInit() {
  }

  showUserInfo(message) {}

  trackById(i, message) {
    return message.id;
  }

}
