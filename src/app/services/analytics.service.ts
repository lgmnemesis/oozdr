import { Injectable } from '@angular/core';
import { AngularFireAnalytics } from '@angular/fire/analytics';
import { User } from 'firebase';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {

  onlyInProd = true;

  constructor(private analytics: AngularFireAnalytics) {}

  private sendEvent(eventName: string, eventParams?: { [key: string]: any; }, options?: firebase.analytics.AnalyticsCallOptions) {
    if (!this.onlyInProd || environment.production) {
      // console.log('Sending event:', eventName, eventParams, options);
      this.analytics.logEvent(eventName, eventParams, options).catch(error => console.error(error));
    }
  }

  setUserId(user: User) {
    if (!this.onlyInProd || environment.production) {
      // console.log('setUserId:', user.uid);
      this.analytics.setUserId(user.uid).catch(error => console.error(error));
    }
  }

  pageViewEvent() {
    this.sendEvent('page_view');
  }

  loginEvent(userCredential: firebase.auth.UserCredential) {
    if (!userCredential) {
      return;
    }
    const type = userCredential.additionalUserInfo.isNewUser ? 'sign_up' : 'login';
    this.sendEvent(type, {user_id: userCredential.user.uid});
  }

  loginErrorEvent(error: string) {
    this.sendEvent('login_error', {msg: error});
  }

  logoutEvent(userId: string) {
    this.sendEvent('logout', {user_id: userId});
  }

  versionEvent(version: string) {
    this.sendEvent('client', { version: version });
  }

  siteMenuEvent() {
    this.sendEvent('site_menu', { clicked: 1 });
  }

  addBeatFromFirstCardButtonEvent() {
    this.sendEvent('add_beat_card_btn', { clicked: 1 });
  }

  addBeatButtonEvent() {
    this.sendEvent('add_beat_btn', { clicked: 1 });
  }

  addClosureButtonEvent() {
    this.sendEvent('add_closure_btn', { clicked: 1 });
  }

  beatAddedEvent() {
    this.sendEvent('beat_added', { clicked: 1 });
  }

  closureAddedEvent() {
    this.sendEvent('closure_added', { clicked: 1 });
  }

  closureRemovedEvent() {
    this.sendEvent('closure_removed', { clicked: 1 });
  }

  beatRemovedEvent() {
    this.sendEvent('beat_removed', { clicked: 1 });
  }

  matchViewedEvent(matchId: string, userId: string) {
    this.sendEvent('match_viewed', { match_id: matchId, user_id: userId});
  }
  
  matchBlockedEvent() {
    this.sendEvent('match_blocked', { clicked: 1 });
  }

  matchUnblockedEvent() {
    this.sendEvent('match_unblocked', { clicked: 1 });
  }

  deleteAccount() {
    this.sendEvent('delete_account', { clicked: 1 });
  }

  socialShareEvent(shareVia: string) {
    this.sendEvent('social_share', { via: shareVia, clicked: 1 });
  }

  canBeAddedAsAppEvent() {
    this.sendEvent('can_be_app');
  }

  installedAsAppEvent() {
    this.sendEvent('installed_app');
  }

  addAsAppAcceptedEvent() {
    this.sendEvent('acceped_as_app');
  }

  addAsAppDismissedEvent() {
    this.sendEvent('dismissed_as_app');
  }

  ipInfoErrorEvent(error: string) {
    this.sendEvent('ipinfo_error', {msg: error});
  }

  joinUsButtonEvent() {
    this.sendEvent('join_us_btn', { clicked: 1 });
  }

  sendFeedbackEvent(stars = 0) {
    this.sendEvent('feedback', { stars: stars });
  }
}
