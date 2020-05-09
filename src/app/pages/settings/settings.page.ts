import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { SharedStoreService } from 'src/app/services/shared-store.service';
import { Router } from '@angular/router';

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

  constructor(private sharedStoreService: SharedStoreService,
    private cd: ChangeDetectorRef,
    private router: Router) { }

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

  profileChanged(isChanged: boolean) {
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
    this.router.navigate(['profile']).catch(error => console.error(error));
  }

  ngOnDestroy() {
    if (this._isVisibleSplitPane) {
      this._isVisibleSplitPane.unsubscribe();
    }
  }
}
