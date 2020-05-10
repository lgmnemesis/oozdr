import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { SharedStoreService } from 'src/app/services/shared-store.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit, OnDestroy {

  isVisibleSplitPane = false;
  _isVisibleSplitPane: Subscription;
  firstTime = true;
  isSettingsChanged = false;
  saveButtonAction: {save: boolean, cancel: boolean} = {save: false, cancel: false};
  showNotifications = true;
  version = this.sharedService.getClientVersion();

  constructor(private sharedStoreService: SharedStoreService,
    private cd: ChangeDetectorRef,
    private router: Router,
    private authService: AuthService,
    private sharedService: SharedService) { }

  ngOnInit() {
    this.sharedStoreService.useSplitPaneSubject.next(true);
    this._isVisibleSplitPane = this.sharedStoreService.isVisibleSplitPane$.subscribe((isVisible) => {
      this.isVisibleSplitPane = isVisible;
      this.markForCheck();
    });
  }

  markForCheck() {
    this.cd.markForCheck();
  }

  toggleNotifications(event) {
    this.showNotifications = event.detail.checked;
  }

  logout() {
    this.authService.logout();
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
    this.router.navigate([url]).catch(error => console.error(error));
  }

  ngOnDestroy() {
    if (this._isVisibleSplitPane) {
      this._isVisibleSplitPane.unsubscribe();
    }
  }
}
