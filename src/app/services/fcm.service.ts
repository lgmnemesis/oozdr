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
    if (profile) {
      const fcmToken = profile.fcmToken;
      if (fcmToken !== token) {
        this.databaseService.updateFcmToken(user, token);
      }
    }
  }

  getPermission() {
    this.messaging.requestPermission()
    .then(() => {
      return this.messaging.getToken();
    })
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
