import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy, OnDestroy, Output, EventEmitter, Input } from '@angular/core';
import { SharedStoreService } from 'src/app/services/shared-store.service';
import { Subscription } from 'rxjs';
import { Profile } from 'src/app/interfaces/profile';
import { WelcomeService } from 'src/app/services/welcome.service';
import { FileStorageService } from 'src/app/services/file-storage.service';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-profile-menu',
  templateUrl: './profile-menu.component.html',
  styleUrls: ['./profile-menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileMenuComponent implements OnInit, OnDestroy {

  @Input()
  set saveButtonClicked(action: {save: boolean, cancel: boolean}) {
    if (action && action.save) {
      this.isSaving = true;
      this.saveProfile().finally(() => {
        this.isSaving = false;
        this.markForCheck();
      });
    } else if (action && action.cancel) {
      this.isSaving = false;
      this.resetProfileChanges();
    }
    this.markForCheck();
  }

  @Output() isChangedEvent = new EventEmitter();

  profile: Profile;
  _profile: Subscription;
  isSaving = false;

  constructor(private sharedStoreService: SharedStoreService,
    private cd: ChangeDetectorRef,
    private welcomeService: WelcomeService,
    private fileStorageService: FileStorageService,
    private sharedService: SharedService) { }

  ngOnInit() {
    this._profile = this.sharedStoreService.profile$.subscribe((profile) => {
      this.profile = profile;
      this.markForCheck();
    });
  }

  markForCheck() {
    this.cd.markForCheck();
  }

  isProfileChanged() {
    const isChanged = JSON.stringify(this.profile.basicInfo) !== JSON.stringify(this.welcomeService.basicInfo);
    if (isChanged) {
      this.isChangedEvent.next(true);
    } else {
      this.isChangedEvent.next(false);
    }
  }

  resetProfileChanges() {
    this.welcomeService.basicInfo = JSON.parse(JSON.stringify(this.profile.basicInfo));
    this.profile = JSON.parse(JSON.stringify(this.profile));
    this.isChangedEvent.next(false);
    this.markForCheck();
  }

  async saveProfile() {
    const name = this.welcomeService.basicInfo.name;
    if (!name || name.trim() === '') {
      this.welcomeService.basicInfo.name = this.profile.basicInfo.name;
    }
    
    if (this.welcomeService.basicInfo.profile_img_url) {
      const uploadDir = `${this.sharedService.uploadProfileImgDir}/${this.profile.user_id}`;
      await this.welcomeService.nextStep();
      const file = this.welcomeService.basicInfo.profile_img_file;
      if (file) {
        try {
          const imgUrl = await this.fileStorageService.uploadImgFile(uploadDir, file);
          this.welcomeService.basicInfo.profile_img_url = imgUrl;
        } catch (error) {
          console.error(error);
          this.welcomeService.basicInfo.profile_img_url = '';
        }
      }
    }

    // Save Profile to db
    delete this.welcomeService.basicInfo.profile_img_file;
    const basicInfo = JSON.parse(JSON.stringify(this.welcomeService.basicInfo));
    return this.sharedStoreService.updateProfileData(this.profile, {basicInfo: basicInfo});
  }

  ngOnDestroy() {
    if (this._profile) {
      this._profile.unsubscribe();
    }
  }
}
