import { Component, OnInit, Input, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Match } from 'src/app/interfaces/profile';

@Component({
  selector: 'app-chat-content-view',
  templateUrl: './chat-content-view.component.html',
  styleUrls: ['./chat-content-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatContentViewComponent implements OnInit {

  @Input() myUserId = null;
  @Input() 
  set match(m: Match) {
    this.activeMatch = m;
    this.timeInABottle = {};
    this.markForCheck();
  }

  showUser = false;
  timeInABottle = {};
  activeMatch: Match;

  constructor(private cd: ChangeDetectorRef) { }

  ngOnInit() {
  }

  markForCheck() {
    this.cd.markForCheck();
  }

  showUserInfo(message) {}

  trackById(i, message) {
    return message.id;
  }

}
