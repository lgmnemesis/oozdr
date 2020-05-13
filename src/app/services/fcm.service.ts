import { Injectable } from '@angular/core';
import { DatabaseService } from './database.service';
import * as firebase from 'firebase/app';
import 'firebase/messaging';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from './auth.service';
import { SharedStoreService } from './shared-store.service';

@Injectable({
  providedIn: 'root'
})
export class FcmService {

  messaging = firebase.messaging();
  currentMessage = new BehaviorSubject(null);
  _msg: firebase.Unsubscribe;

  constructor(private authService: AuthService,
    private databaseService: DatabaseService,
    private sharedStoreService: SharedStoreService) { }

  private async updateToken(token) {
    const user = await this.authService.getUser();
    const profile = await this.sharedStoreService.getProfile();
    let shouldUpdateDb = false;
    if (profile) {
      let fcmTokens = profile.fcmTokens;
      if (fcmTokens && fcmTokens.length > 0) {
        const found = fcmTokens.find(t => t === token);
        if (!found) {
          const tokens = fcmTokens.slice(0, 4);
          if (tokens.length >= 5) {
            tokens.shift();
          }
          tokens.push(token);
          fcmTokens = tokens;
          shouldUpdateDb = true;
        }
      } else {
        fcmTokens = [];
        fcmTokens.push(token);
        shouldUpdateDb = true;
      }
      if (shouldUpdateDb) {
        this.databaseService.updateFcmTokens(user, fcmTokens);
      }
    }
  }

  getPermission() {
    this.messaging.getToken()
    .then((token) => {
      this.updateToken(token);
    })
    .catch((error) => {
      console.error(error);
    })
  }

  subscribeToMessages() {
    if (this._msg) {
      return;
    }
    this._msg = this.messaging.onMessage((payload) => {
      console.log('Got message:', payload);
      this.currentMessage.next(payload);
    })
  }
}
