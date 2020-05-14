import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ConnectionsState } from 'src/app/interfaces/connections-state';
import { Subscription } from 'rxjs';
import { SharedStoreService } from 'src/app/services/shared-store.service';
import { Connection, Profile } from 'src/app/interfaces/profile';
import { AuthService } from 'src/app/services/auth.service';
import { FcmService } from 'src/app/services/fcm.service';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-connections',
  templateUrl: './connections.component.html',
  styleUrls: ['./connections.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConnectionsComponent implements OnInit, OnDestroy {

  connections: Connection[];
  profile: Profile;
  isOnlyMatches = false;
  isOnlyBlockedMatches = false;
  showNotificaionsPermission = false;

  connectionsState: ConnectionsState;
  _connectionsState: Subscription;
  _connections: Subscription;
  _profile: Subscription;

  constructor(private sharedStoreService: SharedStoreService,
    private cd: ChangeDetectorRef,
    private authService: AuthService,
    private fcmService: FcmService,
    private sharedService: SharedService) { }

  async ngOnInit() {
    const user = await this.authService.getUser();
    this.sharedStoreService.registerToConnections(user.uid);
    this.sharedStoreService.registerToMatches(user.uid);

    this._connectionsState = this.sharedStoreService.connectionsState$.subscribe((state) => {
      this.connectionsState = state;
      if (state && state.prevState === 'add') {
        this.displayNotificaionsPermission();
      }
      this.markForCheck();
    });

    this._connections = this.sharedStoreService.connections$.subscribe((connections) => {
      this.connections = connections;
      if (connections && connections.length > 0) {
        this.isOnlyMatches = connections.filter(c => !(c.isMatched && !c.isNewMatch && !c.isBlocked)).length === 0;
        this.isOnlyBlockedMatches = connections.filter(c => !c.isBlocked).length === 0;
        const isNewMatches = connections.findIndex(c => c.isNewMatch) > -1;
        this.sharedStoreService.newMatchesIndicatorSubject.next(isNewMatches);
      } else {
        this.isOnlyMatches = false;
        this.sharedStoreService.newMatchesIndicatorSubject.next(false);
      }
      this.markForCheck();
    });

    this._profile = this.sharedStoreService.profile$.subscribe((profile) => {
      this.profile = profile;
    })
  
    this.fcmAction();
  }

  markForCheck() {
    this.cd.markForCheck();
  }

  async fcmAction() {
    this.fcmService.fcmInit();
  }

  async displayNotificaionsPermission() {
    const isDisplay = await this.isDisplayNotificaionsPermission();
    if (isDisplay) {
      console.log('should display notif perm');
    } else {
      console.log('no need');
    }
  }

  async isDisplayNotificaionsPermission(): Promise<boolean> {
    try {
      const displayedAlready = localStorage.getItem(this.sharedService.matchNotifStorageIndicatorName);
      if (displayedAlready) {
        return false;
      }
    } catch (error) {
      console.error(error);
    }
    const isNotifDenied = this.fcmService.isNotificationDenied();
    const subs = await this.fcmService.getSubscription();
    const isSubscribed = !!subs;
    const disabled = this.profile && this.profile.settings && this.profile.settings.notifications === 'disabled';
    console.log('is:', isNotifDenied, isSubscribed, disabled);
    if (isNotifDenied || isSubscribed || disabled) {
      return false;
    }
    return true;
  }

  addConnectionButton() {
    this.sharedStoreService.connectionsStateSubject.next({state: 'add'});
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
    if (this._profile) {
      this._profile.unsubscribe();
    }
  }

}
