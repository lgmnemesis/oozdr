import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Platform, ToastController, LoadingController } from '@ionic/angular';
import { IonToastMessage } from '../interfaces/toast-message';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  EXTRA_SMALL_WINDOW_WIDTH = 415;
  SMALL_WINDOW_WIDTH = 576;
  MEDIUM_WINDOW_WIDTH = 768;
  LARGE_WINDOW_WIDTH = 992;
  EXTRA_LARGE_WINDOW_WIDTH = 1200;
  MEDIUM_WINDOW_HEIGHT = 570;
  LARGE_WINDOW_HEIGHT = 650;

  INITIAL_PHONE_COUNTRY_CODE = 'us';

  dynamicLinkInvitationUrl = 'https://oozdr.page.link/invite';
  ipInfoUrl = 'https://ipapi.co/json';
  defaultPhoneCountryCode: string = null;
  countryCodeStoreKeyName = 'country_code';
  defaultProfileImg =  '/assets/images/profile-def.png';
  toastNotificationsStoragePerfix = 'toast-notif-';
  matchNotifStorageIndicatorPreffix = 'm-notif';
  uploadProfileImgDir = 'profiles';
  currentUrlPath = null;
  private canSendFeedBack = true;

  menu1 = 'profile';
  menu2 = 'connections';
  menu3 = 'matches';

  constructor(private httpClient: HttpClient,
    private platform: Platform,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController) { }

  showInfo() {
    console.log(`Client Version: ${this.getClientVersion()}`);
  }

  getClientVersion() {
    return environment.clientVersion;
  }

  async setDefaultPhoneCountryCode() {
    const storeKey = this.countryCodeStoreKeyName;
    if (this.defaultPhoneCountryCode) {
      return;
    }
    
    // First, Check if exists in local storage and get it
    try {
      const storeValue = localStorage.getItem(storeKey);
      if (storeValue) {
        this.defaultPhoneCountryCode = storeValue;
        return;
      }
    } catch (error) {
      console.error(error);
    }

    const json:any = await this.httpClient.request('GET', this.ipInfoUrl, {responseType:'json'}).toPromise()
      .catch(error => { 
        console.error(error);
        this.defaultPhoneCountryCode = this.INITIAL_PHONE_COUNTRY_CODE;
      });

    try {
      if (json && json.country) {
        const country = json.country;
        this.defaultPhoneCountryCode = country;
        localStorage.setItem(storeKey, country);
      }
    } catch (error) {
      console.error(error);
    }
  }

  isMobileApp() {
    if (this.platform.is('mobile') || this.platform.is('mobileweb') ) {
      return true;
    }
    return false;
  }

  async presentToast(toastMessage: IonToastMessage) {
    const toast = await this.toastCtrl.create({
      header: toastMessage.header || '',
      message: toastMessage.message,
      duration: toastMessage.duration || 3000, // -1 to set no duration time.
      cssClass: 'toast-style',
      position: toastMessage.position || 'bottom',
      buttons: toastMessage.buttons || []
    });
    toast.present();
  }

  async presentLoading(message: string, duration = 0) {
    const loading = await this.loadingCtrl.create({
      message: message,
      duration: duration,
      mode: 'ios'

    });
    loading.present();
    return loading;
  }

  openNewWindow(url: string, windowHeight = 600): Window {
    const width = window.innerWidth;
    const height = window.innerHeight;
    let w: number, left: number;
    try {
      if (width < this.MEDIUM_WINDOW_WIDTH) {
        w = width - 20;
        left = 0;
      } else {
        w = this.MEDIUM_WINDOW_WIDTH;
        left = Number((width / 2) - (w / 2));
      }
      const h = windowHeight;
      const top = Number((height / 2)  - (h / 2));
      const params = `scrollbars=no,resizable=no,
      status=no,location=no,toolbar=no,menubar=no,
      width=${w},height=${h},left=${left},top=${top}`;
      return window.open(url, '', params);
    } catch (error) {
      console.error(error);
    }
  }

  canSendFeedBackTimer(): boolean {
    if (this.canSendFeedBack) {
      this.canSendFeedBack = false;
      setTimeout(() => {
        this.canSendFeedBack = true;
      }, 30000);
      return true;
    }
    return false;
  }

  isInStandaloneMode() {
    try {
      const nav: any = window.navigator;
      if (window.matchMedia('(display-mode: standalone)').matches || nav.standalone || document.referrer.includes('android-app://')) {
        return true;
      }
    } catch (error) {
      console.error(error);  
    }
    return false;
  }

}
