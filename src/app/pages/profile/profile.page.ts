import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { SharedStoreService } from 'src/app/services/shared-store.service';
import { Router } from '@angular/router';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfilePage implements OnInit, OnDestroy {

  isMobile = false;
  isVisibleSplitPane = false;
  _isVisibleSplitPane: Subscription;
  isProfileChanged = false;
  firstTime = true;
  saveButtonAction: {save: boolean, cancel: boolean} = {save: false, cancel: false};

  constructor(private sharedStoreService: SharedStoreService,
    private cd: ChangeDetectorRef,
    private router: Router,
    private sharedService: SharedService) { }

  ngOnInit() {
    this.sharedStoreService.useSplitPaneSubject.next(true);
    this._isVisibleSplitPane = this.sharedStoreService.isVisibleSplitPane$.subscribe((isVisible) => {
      this.isVisibleSplitPane = isVisible;
      this.markForCheck();
    });

    this.isMobile = this.sharedService.isMobileApp();
  }

  markForCheck() {
    this.cd.markForCheck();
  }

  profileChanged(isChanged: boolean) {
    this.isProfileChanged = isChanged;
    if (isChanged && this.firstTime) {
      this.firstTime = false;
    }
    if (isChanged) {
      this.saveButtonAction = {save: false, cancel: false};
    }
    this.cd.detectChanges();
  }

  cancelProfileChanges() {
    this.saveButtonAction = {save: false, cancel: true};
    this.markForCheck();
  }

  saveProfile() {
    this.saveButtonAction = {save: true, cancel: false};
    this.markForCheck();
  }

  gotoSettings() {
    if (!this.isProfileChanged) {
      this.firstTime = true;
    }
    this.sharedStoreService.activeMenuSubject.next('settings');
    this.router.navigate(['settings']).catch(error => console.error(error));
  }

  ngOnDestroy() {
    if (this._isVisibleSplitPane) {
      this._isVisibleSplitPane.unsubscribe();
    }
  }

}
