import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ConnectionsState } from 'src/app/interfaces/connections-state';
import { Subscription } from 'rxjs';
import { SharedStoreService } from 'src/app/services/shared-store.service';
import { Profile } from 'src/app/interfaces/profile';

@Component({
  selector: 'app-connections',
  templateUrl: './connections.component.html',
  styleUrls: ['./connections.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConnectionsComponent implements OnInit, OnDestroy {

  profile: Profile;

  connectionsState: ConnectionsState;
  _connectionsState: Subscription;
  _profile: Subscription;

  constructor(private sharedStatesService: SharedStoreService,
    private cd: ChangeDetectorRef) { }

  ngOnInit() {
    this._connectionsState = this.sharedStatesService.connectionsState$.subscribe((state) => {
      this.connectionsState = state;
      this.markForCheck();
    });

    this._profile = this.sharedStatesService.profile$.subscribe((profile) => {
      this.profile = profile;
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
    if (this._profile) {
      this._profile.unsubscribe();
    }
  }

}
