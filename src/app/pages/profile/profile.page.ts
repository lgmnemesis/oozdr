import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { SharedStoreService } from 'src/app/services/shared-store.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfilePage implements OnInit, OnDestroy {

  isVisibleSplitPane = false;
  _isVisibleSplitPane: Subscription;
  isProfileChanged = false;
  firstTime = true;
  saveButtonAction = {save: false};

  constructor(private sharedStoreService: SharedStoreService,
    private cd: ChangeDetectorRef) { }

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
    this.isProfileChanged = isChanged;
    if (isChanged && this.firstTime) {
      this.firstTime = false;
    }
    this.markForCheck();
  }

  saveProfile() {
    this.saveButtonAction = {save: true};
    this.markForCheck();
  }

  ngOnDestroy() {
    if (this._isVisibleSplitPane) {
      this._isVisibleSplitPane.unsubscribe();
    }
  }

}
