import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, OnDestroy, Input } from '@angular/core';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import { AngularFireAuth } from '@angular/fire/auth';
import { SharedService } from 'src/app/services/shared.service';

export class PhoneNumber {
  country: string;
  line: string;  
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
  phoneError = 'no errors';
  isPhoneError = false;
  isContinueButtonDisabled = false;
  countryCode = this.sharedService.defaultPhoneCountryCode || this.sharedService.INITIAL_PHONE_COUNTRY_CODE;

  constructor(private afAuth: AngularFireAuth,
    private cd: ChangeDetectorRef,
    private sharedService: SharedService) { }

  ngOnInit() {
    this.initRecaptcha();
  }

  markForCheck() {
    this.cd.markForCheck();
  }

  sendLoginCode() {
    this.isContinueButtonDisabled = true;
    this.phoneError = 'no errors';
    this.isPhoneError = false;
    if (!this.getAndVerifyNumber()) {
      this.phoneError = !this.phoneNumber.line  ? 'Please Enter Your Mobile Number' : 'Invalid Number';
      this.isPhoneError = true;
      this.isContinueButtonDisabled = false;
      this.markForCheck();
      return;
    }
    console.log('moshe in sendLoginCode to:', this.phoneNumber.line);

    this.afAuth.signInWithPhoneNumber(this.phoneNumber.line, this.appVerifier)
      .then(result => {
        console.log('moshe confirmationResult');
        this.confirmationResult = result;
        this.markForCheck();
      })
      .catch(error => { 
        console.error(error);
        this.isContinueButtonDisabled = false;
        this.markForCheck();
      });
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

  getAndVerifyNumber(): boolean {
    try {
      const isValid = this.telInputObj.isValidNumber();
      this.phoneNumber.line = this.telInputObj.getNumber();
      console.log('isvalid:', isValid);
      return isValid;
    } catch (error) {
      console.error(error);
    }
    return false;
  }

  telInputObject(obj) {
    this.telInputObj = obj;
  }

  telHasError(event) {
    console.log('telHasError:', event);
    console.log('detailed error:', this.telInputObj.getValidationError());
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
