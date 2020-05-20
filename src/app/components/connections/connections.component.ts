import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ConnectionsState } from 'src/app/interfaces/connections-state';
import { Subscription } from 'rxjs';
import { SharedStoreService } from 'src/app/services/shared-store.service';
import { Connection, Profile } from 'src/app/interfaces/profile';
import { AuthService } from 'src/app/services/auth.service';
import { FcmService } from 'src/app/services/fcm.service';
import { SharedService } from 'src/app/services/shared.service';
import { AnalyticsService } from 'src/app/services/analytics.service';

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
  showNotificaionsInProgress = false;
  showNotificaionsAnimationIn = true;
  connectionsState: ConnectionsState;
  matchNotifStorageIndicator: string;

  _connectionsState: Subscription;
  _connections: Subscription;
  _profile: Subscription;

  constructor(private sharedStoreService: SharedStoreService,
    private cd: ChangeDetectorRef,
    private authService: AuthService,
    private fcmService: FcmService,
    private sharedService: SharedService,
    private analyticsService: AnalyticsService) { }

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
    this.matchNotifStorageIndicator = this.sharedService.matchNotifStorageIndicatorPreffix + `_${user.uid}`;
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
      this.showNotificaionsPermission = true;
      try {
        localStorage.setItem(this.matchNotifStorageIndicator, 'done');
      } catch (error) {
        console.error(error);
      }
      this.markForCheck();
    }
  }

  notNow() {
    this.closeDisplayNotificationElement();
  }

  async sure() {
    if (this.showNotificaionsInProgress) {
      return;
    }
    this.showNotificaionsInProgress = true;
    await this.fcmService.finishSubscriptionProcess();
    this.closeDisplayNotificationElement();
    this.markForCheck();
  }

  closeDisplayNotificationElement() {
    this.showNotificaionsAnimationIn = false;
    setTimeout(() => {
      this.showNotificaionsPermission = false;
      this.showNotificaionsInProgress = false;
      this.markForCheck();
    }, 500);
  }

  async isDisplayNotificaionsPermission(): Promise<boolean> {
    try {
      const displayedAlready = localStorage.getItem(this.matchNotifStorageIndicator);
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
    if (isNotifDenied || isSubscribed || disabled) {
      return false;
    }
    return true;
  }

  addConnectionButton() {
    this.sharedStoreService.connectionsStateSubject.next({state: 'add'});
    this.analyticsService.addConnectionEvent();
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
