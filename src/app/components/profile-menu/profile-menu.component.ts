import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy, OnDestroy, Output, EventEmitter, Input } from '@angular/core';
import { SharedStoreService } from 'src/app/services/shared-store.service';
import { Subscription } from 'rxjs';
import { Profile } from 'src/app/interfaces/profile';
import { WelcomeService } from 'src/app/services/welcome.service';
import { FileStorageService } from 'src/app/services/file-storage.service';

@Component({
  selector: 'app-profile-menu',
  templateUrl: './profile-menu.component.html',
  styleUrls: ['./profile-menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileMenuComponent implements OnInit, OnDestroy {

  @Input()
  set saveButtonClicked(action: {save: boolean}) {
    if (action && action.save) {
      this.isSaving = true;
      console.log('moshe saving now.');
      this.saveProfile().finally(() => {
        console.log('moshe: savingProfile done.');
        this.isSaving = false;
        this.markForCheck();
      });
      this.markForCheck();
    }
  }

  @Output() isChangedEvent = new EventEmitter();

  profile: Profile;
  _profile: Subscription;
  isSaving = false;

  constructor(private sharedStoreService: SharedStoreService,
    private cd: ChangeDetectorRef,
    private welcomeService: WelcomeService,
    private fileStorageService: FileStorageService) { }

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

  async saveProfile() {
    if (this.welcomeService.basicInfo.profile_img_url) {
      const uploadDir = `profiles/${this.profile.user_id}`;
      await this.welcomeService.nextStep();
      const file = this.welcomeService.basicInfo.profile_img_file;
      if (file) {
        console.log('moshe before uploading');
        try {
          const imgUrl = await this.fileStorageService.uploadImgFile(uploadDir, file);
          console.log('moshe result:', imgUrl);
          this.welcomeService.basicInfo.profile_img_url = imgUrl;
        } catch (error) {
          console.error(error);
        }
      }
    }

    // Save Profile to db
    delete this.welcomeService.basicInfo.profile_img_file;
    const basicInfo = JSON.parse(JSON.stringify(this.welcomeService.basicInfo));
    console.log('saving basicInfo:', basicInfo);
    return this.sharedStoreService.updateProfileData(this.profile, {basicInfo: basicInfo});
  }

  ngOnDestroy() {
    if (this._profile) {
      this._profile.unsubscribe();
    }
  }
}
