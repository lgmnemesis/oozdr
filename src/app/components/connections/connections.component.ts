import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ConnectionsState } from 'src/app/interfaces/connections-state';
import { Subscription } from 'rxjs';
import { SharedStoreService } from 'src/app/services/shared-store.service';
import { Connection } from 'src/app/interfaces/profile';
import { AuthService } from 'src/app/services/auth.service';

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
    private cd: ChangeDetectorRef,
    private authService: AuthService) { }

  async ngOnInit() {
    const user = await this.authService.getUser();
    this.sharedStoreService.registerToConnections(user.uid);
    this.sharedStoreService.registerToMatches(user.uid);

    this._connectionsState = this.sharedStoreService.connectionsState$.subscribe((state) => {
      this.connectionsState = state;
      this.markForCheck();
    });

    this._connections = this.sharedStoreService.connections$.subscribe((connections) => {
      this.connections = connections;
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
