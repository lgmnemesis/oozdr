import { Component, OnInit, ChangeDetectorRef, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { Subscription } from 'rxjs';
import { SharedStatesService } from 'src/app/services/shared-states.service';
import { ConnectionsState } from 'src/app/interfaces/connections-state';

@Component({
  selector: 'app-connections-page',
  templateUrl: './connections.page.html',
  styleUrls: ['./connections.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConnectionsPage implements OnInit, OnDestroy {

  isVisibleSplitPane = false;
  _isVisibleSplitPane: Subscription;
  connectionsState: ConnectionsState;
  _connectionsState: Subscription;

  constructor(private sharedStatesService: SharedStatesService,
    private cd: ChangeDetectorRef) { }

  ngOnInit() {
    this.sharedStatesService.useSplitPaneSubject.next(true);
    this._isVisibleSplitPane = this.sharedStatesService.isVisibleSplitPane$.subscribe((isVisible) => {
      this.isVisibleSplitPane = isVisible;
      this.markForCheck();
    });

    this._connectionsState = this.sharedStatesService.connectionsState$.subscribe((state) => {
      this.connectionsState = state;
      this.markForCheck();
    });

    this.sharedStatesService.connectionsStateSubject.next({state: 'view'});
    this.sharedStatesService.activeMenu = 'connections';

    // this.sharedService.setDefaultPhoneCountryCode();
  }

  markForCheck() {
    this.cd.markForCheck();
  }

  addConnectionButton() {
    this.sharedStatesService.connectionsStateSubject.next({state: 'add'});
  }

  ngOnDestroy() {
    if (this._isVisibleSplitPane) {
      this._isVisibleSplitPane.unsubscribe();
    }
    if (this._connectionsState) {
      this._connectionsState.unsubscribe();
    }
  }
}
