import { Component, OnInit, ChangeDetectorRef, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { Subscription } from 'rxjs';
import { SharedStoreService } from 'src/app/services/shared-store.service';
import { ConnectionsState } from 'src/app/interfaces/connections-state';
import { SharedService } from 'src/app/services/shared.service';
import { FcmService } from 'src/app/services/fcm.service';

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

  constructor(private sharedStoreService: SharedStoreService,
    private cd: ChangeDetectorRef,
    private sharedService: SharedService,
    private fcmService: FcmService) { }

  ngOnInit() {
    this.sharedStoreService.useSplitPaneSubject.next(true);
    this._isVisibleSplitPane = this.sharedStoreService.isVisibleSplitPane$.subscribe((isVisible) => {
      this.isVisibleSplitPane = isVisible;
      this.markForCheck();
    });

    this._connectionsState = this.sharedStoreService.connectionsState$.subscribe((state) => {
      this.connectionsState = state;
      this.markForCheck();
    });

    this.sharedStoreService.connectionsStateSubject.next({state: 'view'});
    this.sharedStoreService.activeMenuSubject.next('connections');

    this.sharedService.setDefaultPhoneCountryCode();

    this.fcmService.fcmInit();
  }

  markForCheck() {
    this.cd.markForCheck();
  }

  addConnectionButton() {
    this.sharedStoreService.connectionsStateSubject.next({state: 'add'});
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
