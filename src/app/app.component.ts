import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { SharedService } from './services/shared.service';
import { SwUpdate } from '@angular/service-worker';
import { AuthService } from './services/auth.service';
import { SharedStoreService } from './services/shared-store.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {

  useSplitPane = false;
  isVisibleSplitPane = false;
  activeMenu: string;

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
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // this.statusBar.styleDefault();
      // this.splashScreen.hide();
      this.sharedService.showInfo();
      this.subscribeToVersionUpdate();
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

  ionSplitPaneOutputEvent(event) {
    this.isVisibleSplitPane = event.detail.visible;
    this.sharedStoreService.isVisibleSplitPaneSubject.next(this.isVisibleSplitPane);
  } 

  connectionsClicked() {
    this.sharedStoreService.activeMenuSubject.next('connections');
    this.gotoActiveMenu('connections');
  }

  matchesClicked() {
    this.sharedStoreService.activeMenuSubject.next('matches');
    // this.gotoActiveMenu();
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
    this.authService.logout(true);
  }

  gotoActiveMenu(url: string) {
    this.router.navigate([url]).catch(error => console.error(error));
  }

  toggleMatches() {
    this.sharedStoreService.isMatchesOpen = !this.sharedStoreService.isMatchesOpen;
  }
}
