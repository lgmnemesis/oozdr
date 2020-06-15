import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { DatabaseService } from 'src/app/services/database.service';
import { SharedService } from 'src/app/services/shared.service';
import { Feedback } from 'src/app/interfaces/general';
import { IonToastMessage } from 'src/app/interfaces/toast-message';
import { Profile } from 'src/app/interfaces/profile';
import { SharedStoreService } from 'src/app/services/shared-store.service';
import { LocaleService } from 'src/app/services/locale.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContactComponent implements OnInit {

  sending = false;
  feedback: Feedback;
  profile: Profile;
  dictionary = this.localeService.dictionary;
  dictContact = this.dictionary.contactComponent;

  constructor(private databaseService: DatabaseService,
    private sharedService: SharedService,
    private sharedStoreService: SharedStoreService,
    private cd: ChangeDetectorRef,
    private localeService: LocaleService) { }

  ngOnInit() {
    this.createFeedback();
  }

  markForCheck() {
    this.cd.markForCheck();
  }

  async createFeedback() {
    this.profile = await this.sharedStoreService.getProfile();
    this.feedback = {
      name: '',
      email: '',
      message: ''
    }
    if (this.profile) {
      this.feedback.user_id = this.profile.user_id;
      this.feedback.name = this.profile.basicInfo.name;
      this.feedback.email = this.profile.basicInfo.email;
    }
    this.markForCheck();
  }

  setName(event) {
    this.feedback.name = event.detail.value;
  }
  
  setEmail(event) {
    this.feedback.email = event.detail.value;
  }
  
  setMessage(event) {
    this.feedback.message = event.detail.value;
  }

  sendMessage() {
    this.sending = true;
    if (this.validate()) {
      const feedback = JSON.parse(JSON.stringify(this.feedback));
      this.databaseService.addFeedback(feedback);
      const toast: IonToastMessage = {
        header: this.dictContact.sendMessageHeader,
        message: this.dictContact.sendMessage,
        duration: 5000,
        position: 'top',
      }
      this.createFeedback();
      this.sharedService.presentToast(toast);
    }
    this.sending = false;
    this.markForCheck();
  }

  validate() {
    return this.feedback.name.length > 1 
      && this.feedback.email.match(this.sharedService.mailformat)
      && this.feedback.message.length > 3
      && this.sharedService.canSendFeedBackTimer();
  }
}
