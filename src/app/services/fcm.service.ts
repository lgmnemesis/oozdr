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
  swRegistration: ServiceWorkerRegistration

  constructor(private authService: AuthService,
    private databaseService: DatabaseService,
    private sharedStoreService: SharedStoreService) { }


  async fcmInit() {
    const reg = await this.registerToServiceWorker();
    const subs = await this.getSubscription();
    if (subs) {
      console.log('moshe init: subs:', subs);
      this.finishSubscriptionProcess();
    } else if (reg) {
      console.log('moshe init no subs. need to prompt');
      // Need to prompt user for permission
      this.sharedStoreService.fcmStateSubject.next({isRegistered: true, isSubscribed: false});
    } else {
      console.log('moshe init 3');
      this.sharedStoreService.fcmStateSubject.next({isRegistered: false, isSubscribed: false});
    }
  }

  async finishSubscriptionProcess() {
    await this.getPermission();
    this.subscribeToTokenRefresh();
    this.subscribeToMessages();
    this.sharedStoreService.fcmStateSubject.next({isRegistered: true, isSubscribed: true});
  }

  private async updateToken(token: string) {
    const user = await this.authService.getUser();
    const profile = await this.sharedStoreService.getProfile();
    let shouldUpdateDb = false;
    if (user && profile) {
      let fcmTokens = profile.fcmTokens;
      if (fcmTokens && fcmTokens.length > 0) {
        const found = fcmTokens.find(t => t === token);
        if (!found) {
          const tokens = fcmTokens.slice(0, 4);
          if (tokens.length === 5) {
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

  private async registerToServiceWorker() {
    if (!('serviceWorker' in navigator)) {
      console.error('serviceWorker not supported.');
      return null;
    } 
    try {
      this.swRegistration = await navigator.serviceWorker.register('fcm-sw.js');
      this.messaging.useServiceWorker(this.swRegistration);
    } catch (error) {
      console.error(error);
      return null;
    }
    return this.swRegistration;
  }

  async getSubscription() {
    try {
      return this.swRegistration.pushManager.getSubscription();
    }
    catch (error) {
      return console.error(error);
    }
  }

  async unsubscribe() {
    const subs = await this.getSubscription();
    if (subs) {
      try {
        await subs.unsubscribe();
        await this.unsubscribeAllTokens();
        this.sharedStoreService.fcmStateSubject.next({isRegistered: true, isSubscribed: false});
      } catch (error) {
        console.error(error);
      }
    }
  }

  async unsubscribeCurrentToken() {
    const subs = await this.getSubscription();
    if (subs) {
      console.log(subs);
    }
  }

  async getPermission() {
    try {
      const token = await this.messaging.getToken();
      this.updateToken(token);
    }
    catch (error) {
      console.error(error);
    }
  }

  subscribeToTokenRefresh() {
    this.messaging.onTokenRefresh(() => {
      console.log('moshe token refreshed');
      return this.getPermission();
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

  private async unsubscribeAllTokens() {
    // Removing tokens from profile
    try {
      const user = await this.authService.getUser();
      const profile = await this.sharedStoreService.getProfile();
      let fcmTokens = profile.fcmTokens;
      if (fcmTokens && fcmTokens.length > 0) {
        fcmTokens.forEach(async token => {
          try {
            await this.messaging.deleteToken(token);
          } catch (error) {
            console.error(error);
          }
        });
        fcmTokens = [];
        this.databaseService.updateFcmTokens(user, fcmTokens);
      }
    } catch (error) {
      console.error(error); 
    }
  }
}
