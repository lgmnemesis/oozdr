import { Injectable } from '@angular/core';
import { AngularFireAnalytics } from '@angular/fire/analytics';
import { User } from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {

  constructor(private analytics: AngularFireAnalytics) { }

  private sendEvent(eventName: string, eventParams?: { [key: string]: any; }, options?: firebase.analytics.AnalyticsCallOptions) {
    console.log('Sending event:', eventName, eventParams, options);
    this.analytics.logEvent(eventName, eventParams, options).catch(error => console.error(error));
  }

  setUserId(user: User) {
    console.log('setUserId:', user.uid);
    this.analytics.setUserId(user.uid).catch(error => console.error(error));
  }

  pageViewEvent() {
    this.sendEvent('page_view');
  }

  loginEvent(userCredential: firebase.auth.UserCredential) {
    if (!userCredential) {
      return;
    }
    const type = userCredential.additionalUserInfo.isNewUser ? 'sign_up' : 'login';
    this.sendEvent(type, {uid: userCredential.user.uid});
  }

  logoutEvent(userId: string) {
    this.sendEvent('logout', {uid: userId});
  }

  versionEvent(version: string) {
    this.sendEvent('client', { version: version });
  }
}
