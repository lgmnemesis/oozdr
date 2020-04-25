import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  INITIAL_PHONE_COUNTRY_CODE = 'us';

  defaultPhoneCountryCode: string = null;
  shouldAnimateStartPage = true;
  ipInfoUrl = 'https://ipinfo.io/json';
  canEnterWelcome = false;
  canEnterHome = false;

  constructor() { }

  showInfo() {
    console.log(`Client Version: ${this.getClientVersion()}`);
  }

  getClientVersion() {
    return environment.clientVersion;
  }

  setDefaultPhoneCountryCode() {

  }
}
