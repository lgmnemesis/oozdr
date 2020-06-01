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
  _tokenRefresh: firebase.Unsubscribe;
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
        // Web Push notifications are not supported (this is true in IOS for now)
        return false;
      }
      this.messaging = firebase.messaging();
      this.getPermission();
      this.subscribeToTokenRefresh();
      this.subscribeToMessages();
    } catch (error) {
      console.error(error);
    }
    return this.messaging ? true : false;
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

  async getPermission(canAskUserForPermission = false) {
    if (!this.messaging) {
      return false;
    }
    try {
      if (!this.isNotificationGranted() && !this.isNotificationDenied() && !canAskUserForPermission) {
        return false;
      }
      const token = await this.messaging.getToken();
      this.updateToken(token);
      return true;
    }
    catch (error) {
      console.error(error);
      return false;
    }
  }

  isNotificationDenied() {
    if (!this.messaging) return true;
    return Notification.permission === 'denied';
  }

  isNotificationGranted() {
    if (!this.messaging) return true;
    return Notification.permission === 'granted';
  }

  private subscribeToTokenRefresh() {
    if (this._tokenRefresh || !this.messaging)  return;
    this.messaging.onTokenRefresh(() => {
      return this.getPermission();
    })
  }

  async unsubscribe() {
    if (this.messaging && this.isNotificationGranted()) {
      try {
        const token = await this.messaging.getToken();
        this.messaging.deleteToken(token).catch(error => error.log(error));
        
        const user = await this.authService.getUser();
        this.databaseService.updateNotificationsSettingsState(user, 'disabled');
      } catch (error) {
        console.error(error);
      }
    }
  }

  private subscribeToMessages() {
    if (this._msg || !this.messaging) return;

    this._msg = this.messaging.onMessage((payload) => {
    
      if (payload && payload.data && payload.data.type === 'looking4u') {
        const body = 'Do you know who it is? Can you guess?';
        const message: FcmMessage = {title: payload.notification.title, content: body};
        this.alertsService.sendFcmMessage(message);
      }

    })
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
