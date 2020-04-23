import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { BasicInfo } from 'src/app/interfaces/registration';
import { WelcomeService } from 'src/app/services/welcome.service';

@Component({
  selector: 'app-welcome-info',
  templateUrl: './welcome-info.component.html',
  styleUrls: ['./welcome-info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WelcomeInfoComponent implements OnInit {

  basicInfo: BasicInfo = this.welcomeService.getInfo();

  nameError = 'no errors';
  isNameError = false;
  genderError = 'no errors';
  isGenderError = false;
  emailError = 'no errors';
  isEmailError = false;
  birthdayError = 'no errors';
  isBirthdayError = false;

  constructor(private welcomeService: WelcomeService,
    private cd: ChangeDetectorRef) { }

  ngOnInit() {}

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
    console.log('moshe:', files);
    const file = files[0];

    if (file.type.split('/')[0] !== 'image') {
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
    this.basicInfo.profilePhoto = readerAsDataURLEvent.target.result;

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

  nextStep() {
    if (this.isValidatedForm()) {

    }
  }

  isValidName() {
    this.nameError = 'no errors';
    this.isNameError = false;
    const name = this.basicInfo.name.trim();
    if (!name) {
      this.nameError = 'Please enter your name';
      this.isNameError = true;      
    } else if (!name.match(/^[a-zA-Z ]+$/)) {
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

  isValidatedForm() {
    this.isValidName();
    this.isValidGender();
    this.isValidEmail();
    this.isValidBirthday();
    const isValidated = !this.isNameError && !this.isGenderError && !this.isEmailError && !this.isBirthdayError;
    console.log('isValidated:', isValidated);
    return isValidated;
  }

}
