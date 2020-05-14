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
  registeredLock = false;

  constructor(private authService: AuthService,
    private databaseService: DatabaseService,
    private sharedStoreService: SharedStoreService) { }


  async fcmInit() {
    const reg = await this.registerToServiceWorker();
    const subs = await this.getSubscription();
    console.log('subs:', subs);
    if (subs) {
      this.finishSubscriptionProcess();
      return subs;
    }
    return null;
  }

  async finishSubscriptionProcess(): Promise<boolean> {
    const got = await this.getPermission();
    this.subscribeToTokenRefresh();
    this.subscribeToMessages();
    return got;
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
        this.databaseService.updateNotificationsState(user, fcmTokens, 'enabled');
      }
    }
  }

  private async registerToServiceWorker() {
    if (this.registeredLock) {
      return null;
    }
    this.registeredLock = true;
    if (!('serviceWorker' in navigator)) {
      console.error('serviceWorker not supported.');
      return null;
    } 
    try {
      this.swRegistration = await navigator.serviceWorker.register('fcm-sw.js');
      this.messaging.useServiceWorker(this.swRegistration);
      console.log('moshe registerd');
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
      console.error(error);
      return null;
    }
  }

  async unsubscribe() {
    const subs = await this.getSubscription();
    if (subs) {
      try {
        await subs.unsubscribe();
        await this.removeAllTokensFromDB();
      } catch (error) {
        console.error(error);
      }
    }
  }

  async getPermission() {
    try {
      const token = await this.messaging.getToken();
      this.updateToken(token);
      return true;
    }
    catch (error) {
      console.error(error);
      return false;
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
      console.log('moshe got message:', payload);
      this.currentMessage.next(payload);
    })
  }

  isNotificationDenied() {
    return Notification.permission === 'denied';
  }

  private async removeAllTokensFromDB() {
    const user = await this.authService.getUser();
    const profile = await this.sharedStoreService.getProfile();
    const fcmTokens = [];
    if (profile && profile.fcmTokens && profile.fcmTokens.length > 0) {
      this.databaseService.updateNotificationsState(user, fcmTokens, 'disabled');
    }
  }
}
