import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy, OnDestroy, Output, EventEmitter } from '@angular/core';
import { SharedStoreService } from 'src/app/services/shared-store.service';
import { Subscription } from 'rxjs';
import { Profile } from 'src/app/interfaces/profile';
import { WelcomeService } from 'src/app/services/welcome.service';

@Component({
  selector: 'app-profile-menu',
  templateUrl: './profile-menu.component.html',
  styleUrls: ['./profile-menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileMenuComponent implements OnInit, OnDestroy {

  @Output() isChangedEvent = new EventEmitter();

  profile: Profile;
  _profile: Subscription;

  constructor(private sharedStoreService: SharedStoreService,
    private cd: ChangeDetectorRef,
    private welcomeService: WelcomeService) { }

  ngOnInit() {
    this._profile = this.sharedStoreService.profile$.subscribe((profile) => {
      this.profile = profile;
      console.log('profie:', profile);
      this.markForCheck();
    });
  }

  markForCheck() {
    this.cd.markForCheck();
  }

  isProfileChanged() {
    console.log('profile:', this.profile.basicInfo, ' info:', this.welcomeService.basicInfo);
    const isChanged = JSON.stringify(this.profile.basicInfo) !== JSON.stringify(this.welcomeService.basicInfo);
    if (isChanged) {
      console.log('was changed');
      this.isChangedEvent.next(true);
    } else {
      console.log('all good');
      this.isChangedEvent.next(false);
    }
  }

  ngOnDestroy() {
    if (this._profile) {
      this._profile.unsubscribe();
    }
  }
}
