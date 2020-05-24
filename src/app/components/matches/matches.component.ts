import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef, Output, EventEmitter, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { SharedStoreService } from 'src/app/services/shared-store.service';
import { Connection, Match, LastMessage } from 'src/app/interfaces/profile';
import { ConnectionsService } from 'src/app/services/connections.service';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-matches',
  templateUrl: './matches.component.html',
  styleUrls: ['./matches.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MatchesComponent implements OnInit, OnDestroy {

  @Input() nobox = false;
  @Output() matchClicked = new EventEmitter();

  activeMenu: string;
  _activeMenu: Subscription;
  connections: Connection[];
  _connections: Subscription;
  _matches: Subscription;
  noMatches = false;
  matches: Match[];

  constructor(public sharedStoreService: SharedStoreService,
    private cd: ChangeDetectorRef,
    private connetionsService: ConnectionsService,
    public sharedService: SharedService) {}

  ngOnInit() {
    this._connections = this.sharedStoreService.connections$.subscribe((connections) => {
      this.connections = connections;
      this.noMatches = connections && connections.length == 0;
      if (connections && connections.length > 0) {
        this.noMatches = connections.filter(c => c.isMatched && !c.isBlocked).length === 0;
      }
      this.markForCheck();
    });

    this._activeMenu = this.sharedStoreService.activeMenu$.subscribe((active) => {
      this.activeMenu = active;
      this.markForCheck();
    });

    this._matches = this.sharedStoreService.matches$.subscribe((matches) => {
      if (matches) {
        this.matches = matches;
        this.markForCheck();
      }
    })
  }

  markForCheck() {
    this.cd.markForCheck();
  }

  matchButtonClicked(event) {
    this.matchClicked.next(true);
    const connection: Connection = event.connection;
    const lastMessage: LastMessage = event.lastMessage;
    this.connetionsService.gotoMatch(connection, lastMessage);
  }

  trackById(i, connection) {
    return connection.id;
  }

  ngOnDestroy() {
    if (this._connections) {
      this._connections.unsubscribe();
    }
    if (this._activeMenu) {
      this._activeMenu.unsubscribe();
    }
    if (this._matches) {
      this._matches.unsubscribe();
    }
  }
}
