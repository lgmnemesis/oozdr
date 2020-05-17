import { Component, OnInit } from '@angular/core';
import { DatabaseService } from 'src/app/services/database.service';
import { SharedService } from 'src/app/services/shared.service';
import { Feedback } from 'src/app/interfaces/general';
import { IonToastMessage } from 'src/app/interfaces/toast-message';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
})
export class ContactComponent implements OnInit {

  sending = false;
  feedback: Feedback;

  constructor(private databaseService: DatabaseService,
    private sharedService: SharedService) { }

  ngOnInit() {
    this.createFeedback();
  }

  createFeedback() {
    this.feedback = {
      name: '',
      email: '',
      message: ''
    }
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
        header: 'THANK YOU!',
        message: 'We have received your question/feedback',
        duration: 5000,
        position: 'top',
      }
      this.createFeedback();
      this.sharedService.presentToast(toast);
    }
    this.sending = false;
  }

  validate() {
    return this.feedback.name.length > 1 
      && this.feedback.email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)
      && this.feedback.message.length > 3
      && this.sharedService.canSendFeedBackTimer();
  }
}
