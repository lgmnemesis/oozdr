import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { SharedStoreService } from 'src/app/services/shared-store.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { SharedService } from 'src/app/services/shared.service';
import { Connection, Profile } from 'src/app/interfaces/profile';
import { AlertController } from '@ionic/angular';
import { FcmService } from 'src/app/services/fcm.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit, OnDestroy {

  isVisibleSplitPane = false;
  _isVisibleSplitPane: Subscription;
  _connections: Subscription;
  firstTime = true;
  isSettingsChanged = false;
  saveButtonAction: {save: boolean, cancel: boolean} = {save: false, cancel: false};
  showNotifications = false;
  version = this.sharedService.getClientVersion();
  isOpenBlockedMatchesList = false;
  blockedMachesCount = 0;
  connections: Connection[] = [];
  defaultProfileImg = this.sharedService.defaultProfileImg;
  lockModal = false;
  profile: Profile;
  isSubscribedLocaly: boolean;
  toggling = false;
  unsubscribeMarker = false;

  constructor(private sharedStoreService: SharedStoreService,
    private cd: ChangeDetectorRef,
    private router: Router,
    private authService: AuthService,
    private sharedService: SharedService,
    private alertCtrl: AlertController,
    private fcmService: FcmService) { }

  ngOnInit() {
    this.sharedStoreService.useSplitPaneSubject.next(true);
    this._isVisibleSplitPane = this.sharedStoreService.isVisibleSplitPane$.subscribe((isVisible) => {
      this.isVisibleSplitPane = isVisible;
      this.markForCheck();
    });

    this._connections = this.sharedStoreService.connections$.subscribe((connections) => {
      this.connections = connections;
      if (connections) {
        const blocked = connections.filter(c => c.isMatched && c.isBlocked);
        this.blockedMachesCount = blocked.length;
        if (this.blockedMachesCount === 0) {
          this.isOpenBlockedMatchesList = false;
        }
      }
      this.markForCheck();
    });

    this.setProfile();
  }

  markForCheck() {
    this.cd.markForCheck();
  }

  async setProfile() {
    this.toggling = this.fcmService.isNotificationDenied();
    this.profile = await this.sharedStoreService.getProfile();
    const subs = await this.fcmService.getSubscription();
    this.isSubscribedLocaly = !!subs;
    if (this.profile && this.profile.settings) {
      this.showNotifications = this.profile.settings.notifications === 'enabled' && !!this.isSubscribedLocaly;
    }
  }

  async toggleNotifications(event) {
    if (this.toggling) {
      return;
    }
    this.toggling = true;
    this.unsubscribeMarker = false;
    let isChecked = event.detail.checked;
    if (isChecked && 
      (!this.profile.settings || (this.profile.settings && this.profile.settings.notifications !== 'enabled') || !this.isSubscribedLocaly)) {
      isChecked = await this.fcmService.finishSubscriptionProcess();
    } else if (!isChecked) {
      this.unsubscribeMarker = true;
    }
    this.showNotifications = isChecked;
    this.toggling = this.fcmService.isNotificationDenied();
    this.markForCheck();
  }

  toggleBlockedMatches() {
    if (this.blockedMachesCount > 0) {
      this.isOpenBlockedMatchesList = !this.isOpenBlockedMatchesList;
    } else {
      this.isOpenBlockedMatchesList = false;
    }
  }

  logout() {
    this.authService.logout();
  }

  goBack() {
    this.sharedStoreService.activeMenuSubject.next('profile');
  }

  deleteAccount() {
    this.authService.deleteAccount();
  }

  settingsChanged(isChanged: boolean) {
    this.isSettingsChanged = isChanged;
    if (isChanged && this.firstTime) {
      this.firstTime = false;
    }
    if (isChanged) {
      this.saveButtonAction = {save: false, cancel: false};
    }
    this.cd.detectChanges();
  }

  cancelSettingsChanges() {
    this.saveButtonAction = {save: false, cancel: true};
    this.markForCheck();
  }

  saveSettings() {
    this.saveButtonAction = {save: true, cancel: false};
    this.markForCheck();
  }

  gotoProfile() {
    this.goto('profile');
  }
  
  goto(url: string) {
    this.sharedService.currentUrlPath = url;
    this.router.navigate([url]).catch(error => console.error(error));
  }

  unBlockButton(connection: Connection) {
    if (this.lockModal) {
      return;
    }
    this.lockModal = true;
    const name = connection.basicInfo.name;
    const nameC = name[0].toUpperCase() + name.slice(1);
    const header = `Unblock ${nameC}?`;
    const message = '';
    const buttonText = 'Unblock';
    this.presentConfirm(header, message, buttonText, false, connection);
  }

  private async presentConfirm(header: string, message: string, buttonText: string, isDangerColor: boolean, connection: Connection) {
    const alert = await this.alertCtrl.create({
      header: header,
      message: message,
      mode: 'ios',
      cssClass: 'alert-confirm-conainer',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            this.lockModal = false;
          }
        }, {
          text: buttonText,
          cssClass: isDangerColor ? 'alert-danger-text-color' : '',
          handler: () => {
            this.sharedStoreService.updateConnectionData(connection, {isBlocked: false});
            this.lockModal = false;
          }
        }
      ]
    });

    await alert.present();
  }

  trackById(i, connection) {
    return connection.id;
  }

  ngOnDestroy() {
    if (this._isVisibleSplitPane) {
      this._isVisibleSplitPane.unsubscribe();
    }
    if (this._connections) {
      this._connections.unsubscribe();
    }
    if (this.unsubscribeMarker) {
      this.fcmService.unsubscribe();
    }
  }
}
