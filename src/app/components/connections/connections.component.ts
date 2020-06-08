import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';
import { ConnectionsState } from 'src/app/interfaces/connections-state';
import { Subscription } from 'rxjs';
import { SharedStoreService } from 'src/app/services/shared-store.service';
import { Connection, Profile } from 'src/app/interfaces/profile';
import { AuthService } from 'src/app/services/auth.service';
import { FcmService } from 'src/app/services/fcm.service';
import { SharedService } from 'src/app/services/shared.service';
import { AnalyticsService } from 'src/app/services/analytics.service';
import { ModalController } from '@ionic/angular';
import { ManageConnectionModalComponent } from '../manage-connection-modal/manage-connection-modal.component';

@Component({
  selector: 'app-connections',
  templateUrl: './connections.component.html',
  styleUrls: ['./connections.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConnectionsComponent implements OnInit, OnDestroy {

  @Output() connectionsEvent = new EventEmitter();

  connections: Connection[];
  profile: Profile;
  isOnlyMatches = false;
  isOnlyBlockedMatches = false;
  isNewMatches = false;
  showNotificaionsPermission = false;
  showNotificaionsInProgress = false;
  showNotificaionsAnimationIn = true;
  connectionsState: ConnectionsState;
  matchNotifStorageIndicator: string;
  isPresentActive = false;
  canHeartBeatAnimation = false;

  _connectionsState: Subscription;
  _connections: Subscription;
  _profile: Subscription;

  constructor(private sharedStoreService: SharedStoreService,
    private cd: ChangeDetectorRef,
    private authService: AuthService,
    private fcmService: FcmService,
    private sharedService: SharedService,
    private analyticsService: AnalyticsService,
    private modalCtrl: ModalController) { }

  async ngOnInit() {
    const user = await this.authService.getUser();
    this.sharedStoreService.registerToConnections(user.uid);
    this.sharedStoreService.registerToMatches(user.uid);

    this._connectionsState = this.sharedStoreService.connectionsState$.subscribe((state) => {
      this.connectionsState = state;
      if (state && (state.state === 'view')) {
        this.modalCtrl.dismiss().catch(error => {});
      }
      if (state && (state.state === 'add' || state.state === 'edit')) {
        this.manageConnections(state);
      } else if (state && state.prevState === 'add') {
        this.displayNotificaionsPermission();
      }
      this.markForCheck();
    });

    this._connections = this.sharedStoreService.connections$.subscribe((connections) => {
      this.connections = connections;
      const isConnections = connections && connections.length > 0;
      this.isOnlyMatches = isConnections && connections.filter(c => !c.isMatched).length === 0;
      this.isOnlyBlockedMatches = isConnections && connections.filter(c => !c.isBlocked).length === 0;
      this.isNewMatches = isConnections && connections.findIndex(c => c.isNewMatch) > -1;
      this.sharedStoreService.newMatchesIndicatorSubject.next(this.isNewMatches);
      if (this.connections && this.connections.length === 0) this.connectionsEvent.next({noConnections: true});

      if (!this.connections || this.connections.length === 0 || this.isOnlyBlockedMatches) {
        console.log('moshe');
        setTimeout(() => {
          this.canHeartBeatAnimation = true;
          this.markForCheck();
        }, 5000);
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
    try {
      await this.fcmService.fcmInit();
    } catch (error) {
      console.error(error);
    }
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
    await this.fcmService.getPermission(true);
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
    const isNotifGranted = this.fcmService.isNotificationGranted();
    const disabled = this.profile && this.profile.settings && this.profile.settings.notifications === 'disabled';
    if (isNotifDenied || disabled || isNotifGranted) {
      return false;
    }
    return true;
  }

  addConnectionButton() {
    this.sharedStoreService.connectionsStateSubject.next({state: 'add'});
    this.analyticsService.addConnectionEvent();
  }

  manageConnections(state: ConnectionsState) {
    if (this.isPresentActive) {
      return;
    }
    this.isPresentActive = true;
    this.sharedStoreService.isModalOpen = true;
    this.presentManageConnections(state);
  }

  async presentManageConnections(state: ConnectionsState) {
    const modal = await this.modalCtrl.create({
      component: ManageConnectionModalComponent,
      cssClass: ['present-modal-properties', 'present-wide-modal-properties'],
      componentProps: {connectionsState: state}
    });

    modal.onDidDismiss().finally(() => {
      this.isPresentActive = false;
      this.sharedStoreService.isModalOpen = false;
      this.sharedStoreService.connectionsStateSubject.next({state: 'view'});
    })
    return await modal.present();
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
