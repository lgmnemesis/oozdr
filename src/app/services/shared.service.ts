import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  INITIAL_PHONE_COUNTRY_CODE = 'us';

  ipInfoUrl = 'https://ipinfo.io/json';
  defaultPhoneCountryCode: string = null;
  countryCodeStoreKeyName = 'country_code';


  constructor(private httpClient: HttpClient) { }

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
        console.log('moshe: got countryCode from store:', storeValue);
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

    console.log('moshe json:', json);
    if (json && json.country) {
      this.defaultPhoneCountryCode = json.country;
      try {
        localStorage.setItem(storeKey, json.country);
      } catch (error) {
        console.error(error);
      }
    }
  }
}
