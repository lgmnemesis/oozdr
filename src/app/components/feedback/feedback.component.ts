import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FeedbackComponent implements OnInit {

  @Output() feedbackEvent = new EventEmitter();

  starSelected = 0;
  message = '';
  canSendMessage = false;
  sending = false;
  showInviteFriendsMessage = false;

  constructor(private cd: ChangeDetectorRef) { }

  ngOnInit() {}

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

  sendMessage() {
    if (this.sending) return;
    this.sending = true;
    if (this.validate()) {
      const feedback = JSON.parse(JSON.stringify(this.message));
      // this.databaseService.addFeedback(feedback);
      if (this.starSelected > 3) {
        // Good review, ask to share with friends
        this.showInviteFriendsMessage = true;
      } else {
        // Not so good review, thank you.
        this.feedbackEvent.next({showThankYouMessage: true});
      }
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
}
