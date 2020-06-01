import { Injectable } from '@angular/core';
import { DatabaseService } from './database.service';
import * as firebase from 'firebase/app';
import 'firebase/messaging';
import { AuthService } from './auth.service';
import { SharedStoreService } from './shared-store.service';
import { SharedService } from './shared.service';
import { fcmToken } from '../interfaces/profile';
import { AlertsService } from './alerts.service';
import { FcmMessage } from '../interfaces/general';

@Injectable({
  providedIn: 'root'
})
export class FcmService {

  messaging: firebase.messaging.Messaging;
  _msg: firebase.Unsubscribe;
  swRegistration: ServiceWorkerRegistration
  registeredLock = false;

  constructor(private authService: AuthService,
    private databaseService: DatabaseService,
    private sharedStoreService: SharedStoreService,
    private sharedService: SharedService,
    private alertsService: AlertsService) { }


  async fcmInit() {
    try {
      if (!('showNotification' in ServiceWorkerRegistration.prototype) || !('PushManager' in window)) {
        // Web Push notifications not supported (this is true in IOS for now)
        return null;
      }
      this.messaging = firebase.messaging();
      const reg = await this.registerToServiceWorker();
      const subs = await this.getSubscription();
      if (subs) {
        this.finishSubscriptionProcess();
        return subs;
      }
    } catch (error) {
      console.error(error);
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
      let fcmTokens: fcmToken[] = JSON.parse(JSON.stringify(profile.fcmTokens));
      const platform = this.sharedService.getPlatformsStr();
      if (fcmTokens && fcmTokens.length > 0) {
        const found = fcmTokens.find(t => t.token && t.token === token);
        if (!found) {
          const tokens = fcmTokens.slice(0, 5);
          const index = tokens.findIndex((t) => t.platform && t.platform === platform);
          if (index > -1) {
            tokens[index] = {platform: platform, token: token};
          } else {
            if (tokens.length === 5) {
              tokens.shift();
            }
            tokens.push({platform: platform, token: token});
          }
          fcmTokens = tokens;
          shouldUpdateDb = true;
        }
      } else {
        fcmTokens = [];
        fcmTokens.push({platform: platform, token: token});
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
    } catch (error) {
      console.error(error);
      return null;
    }
    return this.swRegistration;
  }

  async getSubscription() {
    if (!this.messaging) return null;
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
    if (!this.messaging) {
      return false;
    }
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
    if (this.messaging) {
      this.messaging.onTokenRefresh(() => {
        return this.getPermission();
      })
    }
  }

  subscribeToMessages() {
    if (this._msg || !this.messaging) {
      return;
    }
    this._msg = this.messaging.onMessage((payload) => {
    
      if (payload && payload.data && payload.data.type === 'looking4u') {
        const body = 'Do you know who it is? Can you guess?';
        const message: FcmMessage = {title: payload.notification.title, content: body};
        this.alertsService.sendFcmMessage(message);
      }
      
    })
  }

  isNotificationDenied() {
    if (!this.messaging) return true;
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
