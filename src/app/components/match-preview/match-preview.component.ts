import { Component, OnInit, Input, ChangeDetectionStrategy, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { Connection, LastMessage } from 'src/app/interfaces/profile';
import { SharedService } from 'src/app/services/shared.service';
import { SharedStoreService } from 'src/app/services/shared-store.service';

@Component({
  selector: 'app-match-preview',
  templateUrl: './match-preview.component.html',
  styleUrls: ['./match-preview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MatchPreviewComponent implements OnInit {

  @Input() 
  set isActive(is: boolean) {
    this.isActiveMatch = is;
    this.markForCheck();
  }
  @Input() 
  set setLastMessage(m: LastMessage) {
    this.lastMessage = m;
    if (this.isActiveMatch) {
      console.log('active match:', this.lastMessage);
      this.sharedStoreService.lastActiveMessage = this.lastMessage;
    }
  }
  @Input() connection: Connection;

  @Output() buttonEvent = new EventEmitter;

  lastMessage: LastMessage;
  isActiveMatch = false;
  defaultProfileImg =  this.sharedService.defaultProfileImg;

  constructor(private cd: ChangeDetectorRef,
    private sharedService: SharedService,
    private sharedStoreService: SharedStoreService) {}

  ngOnInit() {
  }

  markForCheck() {
    this.cd.markForCheck();
  }

  selectedMatchButton() {
    this.buttonEvent.next({connection: this.connection, lastMessage: this.lastMessage});
  }
}
