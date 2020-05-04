import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Platform } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  INITIAL_PHONE_COUNTRY_CODE = 'us';

  ipInfoUrl = 'https://ipapi.co/json';
  defaultPhoneCountryCode: string = null;
  countryCodeStoreKeyName = 'country_code';
  defaultProfileImg =  '/assets/images/profile-def.png';

  constructor(private httpClient: HttpClient,
    private platform: Platform) { }

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
}
