import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, Output, EventEmitter, OnDestroy } from '@angular/core';
import { DatabaseService } from 'src/app/services/database.service';
import { Feedback } from 'src/app/interfaces/general';
import { SharedStoreService } from 'src/app/services/shared-store.service';
import { LocaleService } from 'src/app/services/locale.service';
import { Subscription } from 'rxjs';
import { AnalyticsService } from 'src/app/services/analytics.service';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FeedbackComponent implements OnInit, OnDestroy {

  @Output() feedbackEvent = new EventEmitter();

  starSelected = 0;
  message = '';
  canSendMessage = false;
  sending = false;
  showInviteFriendsMessage = false;
  dictionary = this.localeService.dictionary;
  dictFeedback = this.dictionary.feedbackComponent;
  _markForCheckApp: Subscription;

  constructor(private cd: ChangeDetectorRef,
    private databaseService: DatabaseService,
    private sharedStoreService: SharedStoreService,
    private localeService: LocaleService,
    private analyticsService: AnalyticsService) { }

  ngOnInit() {
    this._markForCheckApp = this.sharedStoreService.markForCheckApp$.subscribe((mark) => {
      if (mark) {
        this.dictionary = this.localeService.dictionary;
        this.dictFeedback = this.dictionary.feedbackComponent;
      }
    });
  }

  markForCheck() {
    this.cd.markForCheck();
  }

  starClick(num: number) {
    this.starSelected = num;
    this.validate();
    this.markForCheck();
  }

  setMessage(event) {
    this.message = event.detail.value;
    this.validate();
    this.markForCheck();
  }

  async sendMessage() {
    if (this.sending) return;
    this.sending = true;
    if (this.validate()) {
      const profile = await this.sharedStoreService.getProfile();
      if (profile) {
        const feedback: Feedback = {
          user_id: profile.user_id,
          name: profile.basicInfo.name,
          email: profile.basicInfo.email,
          message: this.message,
          stars: this.starSelected
        }
        this.databaseService.addFeedback(feedback);
      }
      if (this.starSelected > 3) {
        // Good review, ask to share with friends
        this.showInviteFriendsMessage = true;
      } else {
        // Not so good review, thank you.
        this.feedbackEvent.next({showThankYouMessage: true});
      }
      this.analyticsService.sendFeedbackEvent(this.starSelected);
    }
    this.sending = false;
    this.markForCheck();
  }

  validate(): boolean {
    this.canSendMessage = false;
    if (this.message && this.message.length > 0 && this.starSelected > 0) {
      this.canSendMessage = true;
      return true;
    }
    return false;
  }

  socialShareClicked() {
    this.feedbackEvent.next({close: true});
  }

  ngOnDestroy() {
    if (this._markForCheckApp) this._markForCheckApp.unsubscribe();
  }
}
