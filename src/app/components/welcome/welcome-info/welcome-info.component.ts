import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, EventEmitter, Output, Input, AfterViewInit } from '@angular/core';
import { BasicInfo } from 'src/app/interfaces/profile';
import { WelcomeService } from 'src/app/services/welcome.service';
import * as Croppie from 'croppie';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-welcome-info',
  templateUrl: './welcome-info.component.html',
  styleUrls: ['./welcome-info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WelcomeInfoComponent implements OnInit, AfterViewInit {

  @Input() isNext = false;
  @Input() isBack = false;
  @Output() nextEvent = new EventEmitter();

  basicInfo: BasicInfo = this.welcomeService.getInfo();
  croppie: Croppie;

  nameError = 'no errors';
  isNameError = false;
  genderError = 'no errors';
  isGenderError = false;
  emailError = 'no errors';
  isEmailError = false;
  birthdayError = 'no errors';
  isBirthdayError = false;
  isDisableNextButton = false;

  customPickerOptions: any = {};

  constructor(private welcomeService: WelcomeService,
    private cd: ChangeDetectorRef,
    private sharedService: SharedService) { }

  ngOnInit() {
    if (!this.sharedService.isMobileApp()) {
      this.customPickerOptions = {
        cssClass: 'ion-date-style-options',
        animated: false
      };
    }
  }

  ngAfterViewInit() {
    if (this.basicInfo.profile_img_url) {
      this.basicInfo.profile_img_url = this.basicInfo.profile_img_url_org;
      this.cropPhoto();
    }
  }

  markForCheck() {
    this.cd.markForCheck();
  }

  setName(event) {
    this.basicInfo.name = event.detail.value;
    this.isValidName();
  }

  setGender(gender: string) {
    this.basicInfo.gender = gender;
    this.genderError = 'no errors';
    this.isGenderError = false;
  }

  setEmail(event) {
    this.basicInfo.email = event.detail.value;
    this.isValidEmail();
  }

  setBirthday(event) {
    this.basicInfo.birthday = event.detail.value;
    this.isValidBirthday();
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
    this.basicInfo.profile_img_url = readerAsDataURLEvent.target.result;
    this.basicInfo.profile_img_url_org = this.basicInfo.profile_img_url;

    this.cropPhoto();
    this.markForCheck();
  }


  cropPhoto() {
    try {
      if (this.croppie) {
        this.croppie.destroy();
        this.croppie = null;
      }

      const el = document.getElementById('col-photo');
      this.croppie = new Croppie(el, {
          viewport: { width: 200, height: 200, type: 'circle' },
          boundary: { width: 350, height: 350 },
          showZoomer: true,
          enableOrientation: false
      });

      this.croppie.bind({
          url: this.basicInfo.profile_img_url
      }).then(() => {
        const elc = <HTMLElement>document.getElementsByClassName('cr-boundary')[0];
        elc.style.borderRadius = '15px';
        this.markForCheck();
      }).catch((error => console.error(error)));
    } catch (error) {
      console.error(error);
    }
  }

  removeProfilePhoto() {
    if (this.croppie) {
      this.croppie.destroy();
      this.croppie = null;
    }
    this.basicInfo.profile_img_url = '';
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
    if (this.isValidatedForm()) {
      if (this.croppie) {
        const res = await this.croppie.result({ type: 'base64' });
        if (res) {
          this.basicInfo.profile_img_url = res;
        }
        this.croppie.destroy();
        this.croppie = null;
      }
      this.isDisableNextButton = true;
      this.nextEvent.next(true);
      this.markForCheck();
    }
  }

  isValidName() {
    this.nameError = 'no errors';
    this.isNameError = false;
    const name = this.basicInfo.name.trim();
    if (!name) {
      this.nameError = 'Please enter your name';
      this.isNameError = true;      
    } else if (!name.match(/^[\u0590-\u05FF\w ]+$/)) {
      this.nameError = 'Only Letters please';
      this.isNameError = true;
    } else if (name.length < 2) {
      this.nameError = 'Sorry, name is too short';
      this.isNameError = true;
    }
  }

  isValidGender() {
    this.genderError = 'no errors';
    this.isGenderError = false;
    if (this.basicInfo.gender === '') {
      this.genderError = 'Please select a gender';
      this.isGenderError = true;
    }
  }

  isValidEmail() {
    this.emailError = 'no errors';
    this.isEmailError = false;
    const email = this.basicInfo.email.trim();
    if (!email) {
      this.emailError = 'Please enter your email';
      this.isEmailError = true;      
    } else if (!email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)) {
      this.emailError = 'Invalid email address';
      this.isEmailError = true;
    }
  }

  isValidBirthday() {
    this.birthdayError = 'no errors';
    this.isBirthdayError = false;
    const birthday = this.basicInfo.birthday.trim();
    if (!birthday) {
      this.birthdayError = 'Please enter your birthday';
      this.isBirthdayError = true;   
    }
  }

  isValidatedForm(): boolean {
    this.isValidName();
    this.isValidGender();
    this.isValidEmail();
    this.isValidBirthday();
    return !this.isNameError && !this.isGenderError && !this.isEmailError && !this.isBirthdayError;
  }

}
