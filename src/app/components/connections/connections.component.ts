import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ConnectionsState } from 'src/app/interfaces/connections-state';
import { Subscription } from 'rxjs';
import { SharedStoreService } from 'src/app/services/shared-store.service';
import { Connection } from 'src/app/interfaces/profile';

@Component({
  selector: 'app-connections',
  templateUrl: './connections.component.html',
  styleUrls: ['./connections.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConnectionsComponent implements OnInit, OnDestroy {

  connections: Connection[];
  isOnlyMatches = false;

  connectionsState: ConnectionsState;
  _connectionsState: Subscription;
  _connections: Subscription;

  constructor(private sharedStoreService: SharedStoreService,
    private cd: ChangeDetectorRef) { }

  ngOnInit() {
    this._connectionsState = this.sharedStoreService.connectionsState$.subscribe((state) => {
      this.connectionsState = state;
      this.markForCheck();
    });

    this._connections = this.sharedStoreService.connections$.subscribe((connections) => {
      console.log('connections:', connections);
      this.connections = connections;
      this.isOnlyMatches = false;
      if (connections && connections.length > 0) {
        this.isOnlyMatches = connections.filter(c => !(c.isMatched && !c.isNewMatch)).length === 0;
        const isNewMatches = connections.findIndex(c => c.isNewMatch) > -1;
        this.sharedStoreService.newMatchesIndicatorSubject.next(isNewMatches);
      }
      this.markForCheck();
    });
  }

  markForCheck() {
    this.cd.markForCheck();
  }

  trackById(i, connection) {
    return connection.id;
  }

  ngOnDestroy() {
    if (this._connectionsState) {
      this._connectionsState.unsubscribe();
    }
    if (this._connections) {
      this._connections.unsubscribe();
    }
  }

}
