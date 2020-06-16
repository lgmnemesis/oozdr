import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, EventEmitter, Output, Input, OnDestroy } from '@angular/core';
import { Profile } from 'src/app/interfaces/profile';
import { WelcomeService } from 'src/app/services/welcome.service';
import { SharedService } from 'src/app/services/shared.service';
import { LocaleService } from 'src/app/services/locale.service';
import { Subscription } from 'rxjs';
import { SharedStoreService } from 'src/app/services/shared-store.service';

@Component({
  selector: 'app-welcome-info',
  templateUrl: './welcome-info.component.html',
  styleUrls: ['./welcome-info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WelcomeInfoComponent implements OnInit, OnDestroy {

  @Input() isNext = false;
  @Input() isBack = false;
  @Input()
  set myProfile(profile: Profile) {
    this.profile = profile;
    this.setProfile();
  }
  @Input() savingMode = false;

  @Output() nextEvent = new EventEmitter();
  @Output() inputChangedEvent = new EventEmitter();
  
  profile: Profile = null;
  customPickerOptions: any = {};
  cropImgMode = false;
  dictionary = this.localeService.dictionary;
  dictWelcome = this.dictionary.welcomeInfoComponent;
  _markForCheckApp: Subscription;

  constructor(public welcomeService: WelcomeService,
    private cd: ChangeDetectorRef,
    private sharedService: SharedService,
    private localeService: LocaleService,
    private sharedStoreService: SharedStoreService) { }

  ngOnInit() {
    if (!this.sharedService.isMobileApp()) {
      this.customPickerOptions = {
        cssClass: 'ion-date-style-options',
        animated: false
      };
    }
    this.setProfile();

    this._markForCheckApp = this.sharedStoreService.markForCheckApp$.subscribe((mark) => {
      this.dictionary = this.localeService.dictionary;
      this.dictWelcome = this.dictionary.welcomeInfoComponent;
      this.markForCheck();
    });
  }

  markForCheck() {
    this.cd.markForCheck();
  }

  setProfile() {
    if (this.profile) {
      this.welcomeService.basicInfo = JSON.parse(JSON.stringify(this.profile.basicInfo));
      this.welcomeService.profilePhotoText = this.dictWelcome.profilePhoto;
      this.inputChangedEvent.next(true);
    }
    if (!this.welcomeService.basicInfo.profile_img_url) {
      this.cropImgMode = true;
    } else {
      this.cropImgMode = false;
    }
    this.markForCheck();
  }

  setName(event) {
    this.welcomeService.basicInfo.name = event.detail.value;
    const isValid = this.welcomeService.isValidName();
    if (isValid) {
      this.inputChangedEvent.next(true);
    }
    this.markForCheck();
  }

  setGender(gender: string) {
    this.welcomeService.basicInfo.gender = gender;
    this.welcomeService.genderError = 'no errors';
    this.welcomeService.isGenderError = false;
    this.inputChangedEvent.next(true);
    this.markForCheck();
  }

  setEmail(event) {
    this.welcomeService.basicInfo.email = event.detail.value;
    const isValid = this.welcomeService.isValidEmail();
    if (isValid) {
      this.inputChangedEvent.next(true);
    }
    this.markForCheck();
  }

  setBirthday(event) {
    this.welcomeService.basicInfo.birthday = event.detail.value;
    const isValid = this.welcomeService.isValidBirthday();
    if (isValid) {
      this.inputChangedEvent.next(true);
    }
    this.markForCheck();
  }

  async selectPhoto(files: File[]) {
    const file = files[0];

    if (!file) {
      return;
    } else if (file.type.split('/')[0] !== 'image') {
      console.error('unsupported file type');
      return;
    }

    const readerAsDataURLAsync = new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        resolve(event);
      };
      reader.onerror = reject;

      reader.readAsDataURL(file);
    });
    const readerAsDataURLEvent: any = await readerAsDataURLAsync;
    this.welcomeService.basicInfo.profile_img_url = readerAsDataURLEvent.target.result;

    await this.welcomeService.cropPhoto();
    this.inputChangedEvent.next(true);
    this.markForCheck();
  }

  removeProfilePhoto() {
    this.welcomeService.removeProfilePhoto();
    this.cropImgMode = true;
    this.inputChangedEvent.next(true);
    this.markForCheck();
  }
  
  selectPhotoButton() {
    try {
      const el = document.getElementById('file-chip');
      if (el) {
        el.click();
      }
    } catch (error) {
      console.error(error);
    }
  }

  async nextStep() {
    const canNext = await this.welcomeService.nextStep();
    if (canNext) {
      this.cropImgMode = false;
      this.nextEvent.next(true);
    }
    this.markForCheck();
  }

  ngOnDestroy() {
    if (this._markForCheckApp) this._markForCheckApp.unsubscribe();
  }

}
