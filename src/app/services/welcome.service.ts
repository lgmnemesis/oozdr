import { Injectable } from '@angular/core';
import { BasicInfo } from '../interfaces/profile';
import * as Croppie from 'croppie';

@Injectable({
  providedIn: 'root'
})
export class WelcomeService {

  private useLocalStorage = false;
  private infoStore: BasicInfo = null;

  basicInfo: BasicInfo = this.getInfo();
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
  profilePhotoText = 'Profile Photo (optional)';

  constructor() { }

  private getInfoFromStore(): BasicInfo {
    if (!this.useLocalStorage) {
      return this.infoStore;
    }
    try {
      return JSON.parse(localStorage.getItem('basic_info'));
    } catch (error) {
      console.error(error);
    }
    return null;
  }

  private createNewInfo(): BasicInfo {
    this.infoStore = {
      name: '',
      gender: '',
      email: '',
      birthday: '',
      mobile: '',
      profile_img_url: '',
      profile_img_file: ''
    }
    return this.infoStore;
  }

  getInfo() {
    const info = this.getInfoFromStore();
    if (!info) {
      return this.createNewInfo();
    }
    return info;
  }

  storeInfo(info: BasicInfo) {
    try {
      localStorage.setItem('basic_info', JSON.stringify(info));
    } catch (error) {
      console.error(error);
    }
  }

  deleteInfoFromStore() {
    try {
      localStorage.removeItem('basic_info');
    } catch (error) {
      console.error(error);
    }
  }

  isValidName(): boolean {
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
    return !this.isNameError;
  }

  isValidGender(): boolean {
    this.genderError = 'no errors';
    this.isGenderError = false;
    if (this.basicInfo.gender === '') {
      this.genderError = 'Please select a gender';
      this.isGenderError = true;
    }
    return !this.isGenderError;
  }

  isValidEmail(): boolean {
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
    return !this.isEmailError;
  }

  isValidBirthday(): boolean {
    this.birthdayError = 'no errors';
    this.isBirthdayError = false;
    const birthday = this.basicInfo.birthday.trim();
    if (!birthday) {
      this.birthdayError = 'Please enter your birthday';
      this.isBirthdayError = true;   
    }
    return !this.isBirthdayError;
  }

  isValidatedForm(): boolean {
    this.isValidName();
    this.isValidGender();
    this.isValidEmail();
    this.isValidBirthday();
    return !this.isNameError && !this.isGenderError && !this.isEmailError && !this.isBirthdayError;
  }

  async nextStep() {
    if (this.isValidatedForm()) {
      if (this.croppie) {
        try {
          const res = await this.croppie.result({ type: 'base64' });
          if (res) {
            this.basicInfo.profile_img_url = res;
            this.basicInfo.profile_img_file = this.convertBase64ImgToFile(res, 'profile.jpg');
          }
        } catch (error) {
          console.error(error);          
        }
        this.croppie.destroy();
        this.croppie = null;
      }
      this.isDisableNextButton = true;
    }
  }

  convertBase64ImgToFile(dataUrl, filename) {
    const arr = dataUrl.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
        
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    
    return new File([u8arr], filename, {type:mime});
  }

  async cropPhoto() {
    try {
      if (this.croppie) {
        this.croppie.destroy();
        this.croppie = null;
      }

      const el = document.getElementById('col-photo');
      this.croppie = new Croppie(el, {
          viewport: { width: 150, height: 150, type: 'circle' },
          boundary: { width: 300, height: 300 },
          showZoomer: true,
          enableOrientation: false
      });

      await this.croppie.bind({
          url: this.basicInfo.profile_img_url
      })
      const elc = <HTMLElement>document.getElementsByClassName('cr-boundary')[0];
      elc.style.borderRadius = '15px';
    } catch (error) {
      console.error(error);
      this.removeProfilePhoto();
    }
  }

  removeProfilePhoto() {
    if (this.croppie) {
      this.croppie.destroy();
      this.croppie = null;
    }
    this.basicInfo.profile_img_url = '';
    delete this.basicInfo.profile_img_file;
  }
}
