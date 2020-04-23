import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  shouldAnimateStartPage = true;

  constructor() { }

  showInfo() {
    console.log(`Client Version: ${this.getClientVersion()}`);
  }

  getClientVersion() {
    return environment.clientVersion;
  }
}
