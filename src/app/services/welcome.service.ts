import { Injectable } from '@angular/core';
import { BasicInfo, Profile } from '../interfaces/profile';
import * as Croppie from 'croppie';
import { AuthService } from './auth.service';
import { SharedService } from './shared.service';
import { SharedStoreService } from './shared-store.service';
import { FileStorageService } from './file-storage.service';
import { NavController } from '@ionic/angular';
import { LocaleService } from './locale.service';

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
  goHomeOnceLock = false;
  dictionary = this.localeService.dictionary;
  dictWelcomeService = this.dictionary.welcomeService;
  defProfilePhotoText = this.dictWelcomeService.defProfilePhotoText;
  profilePhotoText = this.defProfilePhotoText;
  subProfileLock = false;

  constructor(private authService: AuthService,
    private sharedService: SharedService,
    private sharedStoreService: SharedStoreService,
    private fileStorageService: FileStorageService,
    private navCtrl: NavController,
    private localeService: LocaleService) { }

  init() {
    this.authService.signingOut$.subscribe((isSigningOut) => {
      if (isSigningOut) {
        this.sharedStoreService.needToFinishInfoRegistration = false;
        this.goHomeOnceLock = false;
        this.resetParams();
        this.resetStore();
      }
    });

    this.sharedStoreService.markForCheckApp$.subscribe((mark) => {
      if (mark) {
        this.dictionary = this.localeService.dictionary;
        this.dictWelcomeService = this.dictionary.welcomeService;
        this.defProfilePhotoText = this.dictWelcomeService.defProfilePhotoText;
        this.profilePhotoText = this.defProfilePhotoText;
      }
    });

    this.subscribeToProfile();
  }

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
      profile_img_file: '',
      welcome_msg: ''
    }
    return this.infoStore;
  }

  private getInfo() {
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

  resetParams() {
    this.resetErrors();
    this.isDisableNextButton = false;
    this.profilePhotoText = this.defProfilePhotoText;
    this.goHomeOnceLock = false;
  }
  
  resetErrors() {
    this.nameError = 'no errors';
    this.isNameError = false;
    this.genderError = 'no errors';
    this.isGenderError = false;
    this.emailError = 'no errors';
    this.isEmailError = false;
    this.birthdayError = 'no errors';
    this.isBirthdayError = false;
  }

  resetStore() {
    this.basicInfo = null;
    this.infoStore = null;
    try {
      localStorage.removeItem('basic_info');
    } catch (error) {
      console.error(error);
    }
    this.basicInfo = this.getInfo();
  }

  isValidName(): boolean {
    this.nameError = 'no errors';
    this.isNameError = false;
    const name = this.basicInfo.name.trim();
    if (!name) {
      this.nameError = this.dictWelcomeService.nameError_1;
      this.isNameError = true;      
    } else if (!name.match(/^[\u0590-\u05FF\w ]+$/)) {
      this.nameError = this.dictWelcomeService.nameError_2;
      this.isNameError = true;
    } else if (name.length < 2) {
      this.nameError = this.dictWelcomeService.nameError_3;
      this.isNameError = true;
    }
    return !this.isNameError;
  }

  isValidGender(): boolean {
    this.genderError = 'no errors';
    this.isGenderError = false;
    if (this.basicInfo.gender === '') {
      this.genderError = this.dictWelcomeService.genderError;
      this.isGenderError = true;
    }
    return !this.isGenderError;
  }

  isValidEmail(): boolean {
    this.emailError = 'no errors';
    this.isEmailError = false;
    const email = this.basicInfo.email.trim();
    if (!email) {
      this.emailError = this.dictWelcomeService.emailError_1;
      this.isEmailError = true;      
    } else if (!email.match(this.sharedService.mailformat)) {
      this.emailError = this.dictWelcomeService.emailError_2;
      this.isEmailError = true;
    }
    return !this.isEmailError;
  }

  isValidBirthday(): boolean {
    // this.birthdayError = 'no errors';
    // this.isBirthdayError = false;
    // const birthday = this.basicInfo.birthday.trim();
    // if (!birthday) {
    //   this.birthdayError = this.dictWelcomeService.birthdayError;
    //   this.isBirthdayError = true;   
    // }
    // return !this.isBirthdayError;
    return true; // removed date picker for now - do we realy need bearthday?
  }

  isValidatedForm(): boolean {
    this.isValidName();
    this.isValidGender();
    this.isValidEmail();
    this.isValidBirthday();
    return !this.isNameError && !this.isGenderError && !this.isEmailError && !this.isBirthdayError;
  }

  backStep() {
    this.cropiePlease();
  }

  nextStep() {
    if (this.isValidatedForm()) {
      this.cropiePlease();
      this.isDisableNextButton = true;
    } else {
      return false;
    }
    return true;
  }

  async cropiePlease() {
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

  async registerAndUpdate(profile: Profile) {
    
    const file = this.basicInfo.profile_img_file;
    if (file) {
      // Save profile img
      const uploadDir = `${this.sharedService.uploadProfileImgDir}/${profile.user_id}`;
      try {
        const imgUrl = await this.fileStorageService.uploadImgFile(uploadDir, file);
        this.basicInfo.profile_img_url = imgUrl;
        profile.basicInfo.profile_img_url = imgUrl;
      } catch (error) {
        console.error(error);
        this.basicInfo.profile_img_url = '';
        profile.basicInfo.profile_img_url = '';
      }
    }
    delete profile.basicInfo.profile_img_file;
    try {
      const updateProfile = await this.sharedStoreService.updateProfile(profile);
      const register = await this.sharedStoreService.registerToProfile(profile.user_id);
    } catch (error) {
      console.error(error);
      this.sharedStoreService.loadingAppSubject.next(false);
    }
  }

  gotoHome() {
    this.sharedStoreService.canEnterWelcome = false;
    this.sharedStoreService.canEnterHome = true;
    this.goto('/connections');
  }

  gotoWelcome() {
    this.goto('/welcome');
  }

  gotoSupport() {
    this.navCtrl.navigateForward('/support').catch(error => console.error(error));
  }
  
  goto(url) {
    this.navCtrl.navigateRoot(url)
    .then(() => {
      this.sharedStoreService.loadingAppSubject.next(false);
    })
    .catch((error) => {
      console.error(error);
    });
  }

  private subscribeToProfile() {
    if (this.subProfileLock) return;
    this.subProfileLock = true;
    this.sharedStoreService.profile$.subscribe((profile: Profile) => {
      if (profile) {
        if (profile.basicInfo && profile.basicInfo.name) {
          if (!this.goHomeOnceLock)  {
            this.goHomeOnceLock = true;
            this.gotoHome();
          }
        } else {
          // if there is info object, fill it, update and go home
          const info = this.basicInfo;
          if (info && info.name && info.mobile) {
            const profileJ: Profile = JSON.parse(JSON.stringify(profile));
            profileJ.basicInfo = info;
            this.sharedStoreService.updateProfile(profile).catch(error => console.error(error));
            this.gotoHome();
          } else {
            this.sharedStoreService.needToFinishInfoRegistration = true;
            this.gotoWelcome();
          }
        }
      }
    });
  }
}
