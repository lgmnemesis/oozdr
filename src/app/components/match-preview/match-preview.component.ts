import { Component, OnInit, Input, ChangeDetectionStrategy, Output, EventEmitter, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { Connection, Match } from 'src/app/interfaces/profile';
import { SharedService } from 'src/app/services/shared.service';
import { SharedStoreService } from 'src/app/services/shared-store.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-match-preview',
  templateUrl: './match-preview.component.html',
  styleUrls: ['./match-preview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MatchPreviewComponent implements OnInit, OnDestroy {

  @Input() 
  set isActive(is: boolean) {
    this.isActiveMatch = is;
    this.markForCheck();
  }
  @Input() connection: Connection;
  @Output() buttonEvent = new EventEmitter;

  isActiveMatch = false;
  defaultProfileImg =  this.sharedService.defaultProfileImg;
  _matches: Subscription;
  lastMessagesByConnectionId = {};

  constructor(private cd: ChangeDetectorRef,
    private sharedService: SharedService,
    private sharedStoreService: SharedStoreService) {}

  ngOnInit() {
    this._matches = this.sharedStoreService.matches$.subscribe((matches) => {
      if (matches) {
        const clone = JSON.parse(JSON.stringify(matches));
        this.updateLastMessages(clone);
        this.markForCheck();
      }
    })
  }

  markForCheck() {
    this.cd.markForCheck();
  }

  selectedMatchButton() {
    this.buttonEvent.next(true);
  }

  updateLastMessages(matches: Match[]) {
    if (!this.connection) {
      return;
    }
    matches.forEach(match => {
      const last = match.messages.pop();
      if (last) {
        this.lastMessagesByConnectionId[this.connection.id] = last.content;
      }
    });
  }

  ngOnDestroy() {
    if (this._matches) {
      this._matches.unsubscribe();
    }
  }
  
}
