import { Component, AfterViewInit } from '@angular/core';

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
export class AppComponent implements AfterViewInit {

  useSplitPane = false;
  isVisibleSplitPane = false;

  tmps = [1, 2, 3, 4, 5, 6];

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private sharedService: SharedService,
    public sharedStatesService: SharedStoreService,
    private swUpdate: SwUpdate,
    private authService: AuthService,
    private router: Router
  ) {
    this.authService.init();
    this.initializeApp();
    this.subscribeToSplitPaneEvents();
  }

  ngAfterViewInit() {
    try {
      const content = document.querySelector('#split-pane-content');
      this.sharedService.styleIonScrollbars(content);
    } catch (error) {
      console.error(error);
    }
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
    this.sharedStatesService.useSplitPane$.subscribe((isUsed) => {
      this.useSplitPane = isUsed;
    })
  }

  ionSplitPaneOutputEvent(event) {
    this.isVisibleSplitPane = event.detail.visible;
    this.sharedStatesService.isVisibleSplitPaneSubject.next(this.isVisibleSplitPane);
  } 

  connectionsClicked() {
    this.sharedStatesService.activeMenu = 'connections';
    this.gotoActiveMenu();
  }

  matchesClicked() {
    this.sharedStatesService.activeMenu = 'matches';
    this.gotoActiveMenu();
  }

  profileClicked() {
    this.sharedStatesService.activeMenu = 'profile';
    this.gotoActiveMenu();
  }

  settingsClicked() {
    this.sharedStatesService.activeMenu = 'settings';
    this.gotoActiveMenu();
  }

  logoutClicked() {
    this.authService.logout(true);
  }

  gotoActiveMenu() {
    const url = this.sharedStatesService.activeMenu;
    this.router.navigate([url]).catch(error => console.error(error));
  }

  toggleMatches() {
    this.sharedStatesService.isMatchesOpen = !this.sharedStatesService.isMatchesOpen;
  }
}
