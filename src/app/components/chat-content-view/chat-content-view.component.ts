import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-chat-content-view',
  templateUrl: './chat-content-view.component.html',
  styleUrls: ['./chat-content-view.component.scss'],
})
export class ChatContentViewComponent implements OnInit {

  @Input() myUserId = 'moshe_id';

  message1 = {
    user_id: 'moshe_id',
    id: 'id1',
    content: 'content1',
    createdAt: new Date(),
    user_name: 'Moshe Levy'
  }

  message2 = {
    user_id: 'moshe_id2',
    id: 'id2',
    content: 'content1',
    createdAt: new Date(),
    user_name: 'Moshe Levy2'
  }

  chat = {
    messages: []
  };

  timeInABottle = {};

  constructor() { }

  ngOnInit() {
    for (let index = 0; index < 20; index++) {
      this.chat.messages.push(this.message1);
      this.chat.messages.push(this.message2);
    }
  }

  showUserInfo(message) {}

  trackById(i, message) {
    return message.id;
  }

}
