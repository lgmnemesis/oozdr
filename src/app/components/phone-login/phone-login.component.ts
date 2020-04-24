import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, OnDestroy } from '@angular/core';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import { AngularFireAuth } from '@angular/fire/auth';

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
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class PhoneLoginComponent implements OnInit, OnDestroy {

  phoneNumber = new PhoneNumber();
  appVerifier: any;
  verificationCode: string;
  confirmationResult: firebase.auth.ConfirmationResult;
  user: any;
  telInputObj: any

  constructor(private afAuth: AngularFireAuth,
    private cd: ChangeDetectorRef) { }

  ngOnInit() {
    this.initRecaptcha();
  }

  markForCheck() {
    this.cd.markForCheck();
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
        console.log('moshe confirmationResult');
        this.confirmationResult = result;
      })
      .catch(error => console.error(error));
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

  verifyLoginCode() {
    this.confirmationResult.confirm(this.verificationCode)
      .then(result => {
        this.user = result.user;
        console.log('authenticated:', this.user);
      })
      .catch(error => {
        console.error(error);
      });
  }

  telHasError(event) {
    console.log('telHasError:', event);
  }

  telInputObject(obj) {
    console.log('telInputObject:', obj);
    obj.setCountry('il');
    setInterval(() => {
      console.log('number:', obj.getNumber());
      console.log('isValid:', obj.isValidNumber());
    }, 4000);
    this.telInputObj = obj;
  }

  ngOnDestroy() {
    if (this.telInputObj) {
      try {
        this.telInputObj.destroy();
      } catch (error) {
        console.error(error);
      }
    }
  }

}
