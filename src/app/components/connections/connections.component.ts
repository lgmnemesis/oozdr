import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ConnectionsState } from 'src/app/interfaces/connections-state';
import { Subscription } from 'rxjs';
import { SharedStatesService } from 'src/app/services/shared-states.service';

@Component({
  selector: 'app-connections',
  templateUrl: './connections.component.html',
  styleUrls: ['./connections.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConnectionsComponent implements OnInit, OnDestroy {

  connectionsState: ConnectionsState;
  _connectionsState: Subscription;
  items = [1, 2, 3, 4, 5];

  constructor(private sharedStatesService: SharedStatesService,
    private cd: ChangeDetectorRef) { }

  ngOnInit() {
    this._connectionsState = this.sharedStatesService.connectionsState$.subscribe((state) => {
      this.connectionsState = state;
      this.markForCheck();
    });
  }

  markForCheck() {
    this.cd.markForCheck();
  }

  ngOnDestroy() {
    if (this._connectionsState) {
      this._connectionsState.unsubscribe();
    }
  }

}
