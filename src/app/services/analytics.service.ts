import { Injectable } from '@angular/core';
import { NavigationEnd } from '@angular/router';
import { AngularFireAnalytics } from '@angular/fire/analytics';
import { User } from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {

  constructor(private analytics: AngularFireAnalytics) { }

  private sendEvent(eventName: string, eventParams?: { [key: string]: any; }, options?: firebase.analytics.AnalyticsCallOptions) {
    this.analytics.logEvent(eventName, eventParams, options).catch(error => console.error(error));
  }

  setUserId(user: User) {
    console.log('setUserId:', user.uid);
    this.analytics.setUserId(user.uid).catch(error => console.error(error));
  }

  pageViewEvent(event: NavigationEnd) {
    console.log('page_view event:', event.url);
    this.analytics.logEvent('page_view');
  }

  loginEvent(userCredential: firebase.auth.UserCredential) {
    if (!userCredential) {
      return;
    }
    const type = userCredential.additionalUserInfo.isNewUser ? 'sign_up' : 'login';
    console.log('login event:', type);
    this.sendEvent(type, {uid: userCredential.user.uid});
  }

  logoutEvent(userId: string) {
    console.log('logout event:', userId);
    this.sendEvent('logout', {uid: userId});
  }

  versionEvent(version: string) {
    this.sendEvent('client', { version: version });
  }
}
