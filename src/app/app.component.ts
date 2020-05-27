import { Component, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';

import { Platform, ModalController, MenuController, AlertController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { SharedService } from './services/shared.service';
import { SwUpdate } from '@angular/service-worker';
import { AuthService } from './services/auth.service';
import { SharedStoreService } from './services/shared-store.service';
import { Router, NavigationEnd, NavigationStart } from '@angular/router';
import { Profile } from './interfaces/profile';
import { User } from 'firebase';
import { InviteFriendsModalComponent } from './components/invite-friends-modal/invite-friends-modal.component';
import { AnalyticsService } from './services/analytics.service';
import { AlertsService } from './services/alerts.service';
import { Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {

  useSplitPane = false;
  isVisibleSplitPane = false;
  activeMenu: string;
  profile: Profile;
  user: User;
  loadingApp = true;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private sharedService: SharedService,
    public sharedStoreService: SharedStoreService,
    private swUpdate: SwUpdate,
    private authService: AuthService,
    private router: Router,
    private modalCtrl: ModalController,
    private menuCtrl: MenuController,
    private analyticsService: AnalyticsService,
    private alertsService: AlertsService,
    private alertCtrl: AlertController,
    private cd: ChangeDetectorRef,
    private meta: Meta
  ) {
    this.authService.init();
    this.initializeApp();
    this.subscribeToSplitPaneEvents();
    this.subscribeToActiveMenu();
    this.subscribeToUser();
  }

  markForCheck() {
    this.cd.markForCheck();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.subscribeToVersionUpdate();
      this.subscribeToProfile();
      this.subscribeToRouterEvents();
      this.subscribeToLoadingAppEvents();
      this.sharedService.showInfo();
      this.analyticsService.versionEvent(this.sharedService.getClientVersion());
    });
  }

  subscribeToLoadingAppEvents() {
    this.sharedStoreService.loadingApp$.subscribe((isLoading) => {
      setTimeout(() => {
        this.loadingApp = isLoading;
        this.markForCheck();
      }, 1000);
    })
  }

  subscribeToVersionUpdate() {
    if (this.swUpdate.isEnabled) {
      this.swUpdate.available.subscribe((update) => {
        console.log(
          'New version is available and will be active on the next reload/refresh', update
        );
        this.alertsService.sendNewVersionAlert();
      });
    }
  }

  subscribeToSplitPaneEvents() {
    this.sharedStoreService.useSplitPane$.subscribe((isUsed) => {
      this.useSplitPane = isUsed;
    })
  }

  subscribeToActiveMenu() {
    this.sharedStoreService.activeMenu$.subscribe((active) => {
      this.activeMenu = active;
    });
  }

  subscribeToUser() {
    this.authService.user$.subscribe((user) => {
      this.user = user;
    })
  }

  subscribeToRouterEvents() {

    this.router.events.subscribe(async e => {
      if (e instanceof NavigationStart) {
        try {
          const isModal = await this.modalCtrl.getTop();
          if (isModal) {
            this.sharedStoreService.isModalOpen = false;
            this.modalCtrl.dismiss().catch(error => console.error(error));
          }
          this.alertCtrl.dismiss().catch(error => {});
        } catch (error) {
          console.error(error);
        }
      }

      if (e instanceof NavigationEnd) {

        // Manage unread messages indication
        if (this.sharedStoreService.lastActiveMessage && this.sharedStoreService.lastActiveMessage.hasNewMessages) {
          const lastActiveMessage = JSON.parse(JSON.stringify(this.sharedStoreService.lastActiveMessage));
          this.sharedStoreService.lastActiveMessage = null;
          this.sharedStoreService.setMatchPartyHasReadMessages(lastActiveMessage);
        }

        // Send page_view event to analytics
        this.analyticsService.pageViewEvent();
      }
    });
  }

  ionSplitPaneOutputEvent(event) {
    this.isVisibleSplitPane = event.detail.visible;
    this.sharedStoreService.isVisibleSplitPaneSubject.next(this.isVisibleSplitPane);
  } 

  connectionsClicked() {
    this.sharedStoreService.activeMenuSubject.next('connections');
    this.gotoActiveMenu('connections');
  }

  matchClicked() {
    this.sharedStoreService.activeMenuSubject.next('matches');
  }

  profileClicked() {
    this.sharedStoreService.activeMenuSubject.next('profile');
    this.gotoActiveMenu('profile');
  }

  settingsClicked() {
    this.sharedStoreService.activeMenuSubject.next('settings');
    this.gotoActiveMenu('settings');
  }

  logoutClicked() {
    this.authService.logout();
  }

  gotoActiveMenu(url: string) {
    this.menuCtrl.close().catch(error => console.error(error));
    this.router.navigate([url]).catch(error => console.error(error));
  }

  toggleMatches() {
    this.sharedStoreService.isMatchesOpen = !this.sharedStoreService.isMatchesOpen;
  }

  subscribeToProfile() {
    this.sharedStoreService.profile$.subscribe((profile) => {
      this.profile = profile;
    })
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
    modal.onDidDismiss().then(() => {
      this.sharedStoreService.isModalOpen = false;
    });
    return await modal.present();
  }
}
