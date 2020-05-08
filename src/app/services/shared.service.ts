import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Platform, ToastController } from '@ionic/angular';
import { IonToastMessage } from '../interfaces/toast-message';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  INITIAL_PHONE_COUNTRY_CODE = 'us';

  ipInfoUrl = 'https://ipapi.co/json';
  defaultPhoneCountryCode: string = null;
  countryCodeStoreKeyName = 'country_code';
  defaultProfileImg =  '/assets/images/profile-def.png';
  toastNotificationsStoragePerfix = 'toast-notif-';
  uploadProfileImgDir = 'profiles';

  menu1 = 'profile';
  menu2 = 'connections';
  menu3 = 'matches';

  constructor(private httpClient: HttpClient,
    private platform: Platform,
    private toastCtrl: ToastController) { }

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
}
