import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { SharedStoreService } from 'src/app/services/shared-store.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { SharedService } from 'src/app/services/shared.service';
import { Connection, Profile } from 'src/app/interfaces/profile';
import { AlertController, ModalController } from '@ionic/angular';
import { FcmService } from 'src/app/services/fcm.service';
import { InviteFriendsModalComponent } from 'src/app/components/invite-friends-modal/invite-friends-modal.component';
import { AnalyticsService } from 'src/app/services/analytics.service';
import { LocaleService } from 'src/app/services/locale.service';

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
  dictionary = this.localeService.dictionary;
  dictSettings = this.dictionary.settingsPage;
  selectedLangEN = '';
  selectedLangHE = '';
  selectedLang = this.localeService.lang;

  constructor(private sharedStoreService: SharedStoreService,
    private cd: ChangeDetectorRef,
    private router: Router,
    private authService: AuthService,
    private sharedService: SharedService,
    private alertCtrl: AlertController,
    public fcmService: FcmService,
    private modalCtrl: ModalController,
    private analyticsService: AnalyticsService,
    public localeService: LocaleService) { }

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
    this.setLocalLang();

    this.sharedStoreService.markForCheckApp$.subscribe((mark) => {
      if (mark) {
        this.dictionary = this.localeService.dictionary;
        this.dictSettings = this.dictionary.settingsPage;
        this.markForCheck();
      }
    })
  }

  markForCheck() {
    this.cd.markForCheck();
  }

  toggleLang() {
    if (this.selectedLang === 'en') {
      this.selectedLang = 'he';
    } else {
      this.selectedLang = 'en';
    }
    this.setLocalLang();
    this.markForCheck();
  }

  setLocalLang() {
    if (this.selectedLang === 'he') {
      this.selectedLangEN = this.dictSettings.selectedLangEN_1;
      this.selectedLangHE = this.dictSettings.selectedLangHE_1;
    } else {
      this.selectedLangEN = this.dictSettings.selectedLangEN_2;
      this.selectedLangHE = this.dictSettings.selectedLangHE_2;
    }
  }

  setAppLang(event) {
    event.stopPropagation();
    if (this.selectedLang !== this.localeService.lang) {
      this.localeService.toggleLang();
      this.selectedLang = this.localeService.lang;
      this.setLocalLang();
      this.markForCheck();
    }
  }

  async setProfile() {
    this.toggling = this.fcmService.isNotificationDenied();
    this.profile = await this.sharedStoreService.getProfile();
    this.isSubscribedLocaly = this.fcmService.isNotificationGranted();
    if (this.profile && this.profile.settings) {
      this.showNotifications = this.profile.settings.notifications === 'enabled' && this.isSubscribedLocaly;
      this.markForCheck();
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
      isChecked = await this.fcmService.getPermission(true);
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

  inviteFriends() {
    this.sharedStoreService.isModalOpen = true;
    this.presentModal();
  }

  async presentModal() {
    const modal = await this.modalCtrl.create({
      component: InviteFriendsModalComponent,
      cssClass: 'present-modal-properties'
    });

    modal.onWillDismiss()
    .then(() => {
      this.sharedStoreService.isModalOpen = false;
    }).catch(error => console.error(error));

    return await modal.present();
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
    const header = `${this.dictSettings.unBlockHeader} ${nameC}?`;
    const message = '';
    const buttonText = this.dictSettings.unBlockButtonText;
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
          text: this.dictSettings.unblockButtonCancel,
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
            this.analyticsService.matchUnblockedEvent();
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
