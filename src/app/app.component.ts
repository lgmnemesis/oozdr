import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { SharedService } from './services/shared.service';
import { SwUpdate } from '@angular/service-worker';
import { AuthService } from './services/auth.service';
import { SharedStoreService } from './services/shared-store.service';
import { Router, NavigationEnd } from '@angular/router';
import { Profile } from './interfaces/profile';
import { User } from 'firebase';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {

  useSplitPane = false;
  isVisibleSplitPane = false;
  activeMenu: string;
  profile: Profile;
  user: User;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private sharedService: SharedService,
    public sharedStoreService: SharedStoreService,
    private swUpdate: SwUpdate,
    private authService: AuthService,
    private router: Router
  ) {
    this.authService.init();
    this.initializeApp();
    this.subscribeToSplitPaneEvents();
    this.subscribeToActiveMenu();
    this.subscribeToUser();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // this.statusBar.styleDefault();
      // this.splashScreen.hide();
      this.sharedService.showInfo();
      this.subscribeToVersionUpdate();
      this.subscribeToProfile();
      this.subscribeToRouterEvents();
    });
  }

  subscribeToVersionUpdate() {
    if (this.swUpdate.isEnabled) {
      this.swUpdate.available.subscribe((update) => {
        console.log(
          'New version is available and will be active on the next reload/refresh', update
        );
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
    this.router.events.subscribe(e => {
      if (e instanceof NavigationEnd) {

        // Manage unread messages indication
        if (this.sharedStoreService.lastActiveMessage && this.sharedStoreService.lastActiveMessage.hasNewMessages) {
          const lastActiveMessage = JSON.parse(JSON.stringify(this.sharedStoreService.lastActiveMessage));
          this.sharedStoreService.lastActiveMessage = null;
          this.sharedStoreService.setMatchPartyHasReadMessages(lastActiveMessage);
        }

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
}
