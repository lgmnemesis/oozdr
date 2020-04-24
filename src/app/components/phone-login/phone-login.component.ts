import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import { AngularFireAuth } from '@angular/fire/auth';
import { environment } from '../../../environments/environment';

export class PhoneNumber {
  country: string;
  area: string;
  prefix: string;
  line: string;  
  
  // format phone numbers as E.164
  get e164() {
    const num = this.country + this.area + this.prefix + this.line;
    return `+${num}`;
  }
}

@Component({
  selector: 'app-phone-login',
  templateUrl: './phone-login.component.html',
  styleUrls: ['./phone-login.component.scss'],
})

export class PhoneLoginComponent implements OnInit {

  phoneNumber = new PhoneNumber();
  appVerifier: any;
  verificationCode: string;
  confirmationResult: firebase.auth.ConfirmationResult;
  user: any;

  constructor(private afAuth: AngularFireAuth) { }

  ngOnInit() {
    this.initRecaptcha();
  }

  async initRecaptcha() {
    const app = await this.afAuth.app
    this.appVerifier = new firebase.auth.RecaptchaVerifier('sign-in-button', {
      'size': 'invisible',
      'callback': function() {
        // reCAPTCHA solved, allow signInWithPhoneNumber.
        console.log('moshe callback:');
        // this.sendLoginCode();
      }
    }, app);
  }

  sendLoginCode() {
    this.phoneNumber.country = '972';
    this.phoneNumber.area = '054';
    this.phoneNumber.prefix = '';
    this.phoneNumber.line = '3989404';
    const num = this.phoneNumber.e164;
    console.log('moshe in sendLoginCode to:', num);
    this.afAuth.signInWithPhoneNumber(num, this.appVerifier)
      .then(result => {
        console.log('moshe confirmationResult id:', result.verificationId);
        this.confirmationResult = result;
      })
      .catch(error => console.error(error));
  }

  verifyLoginCode() {
    this.confirmationResult.confirm(this.verificationCode)
      .then(result => {
        this.user = result.user;
      })
      .catch(error => {
        console.error(error);
      });
  }

}
