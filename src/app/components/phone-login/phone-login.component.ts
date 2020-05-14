import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, OnDestroy, Output, EventEmitter, Input } from '@angular/core';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import { AngularFireAuth } from '@angular/fire/auth';
import { SharedService } from 'src/app/services/shared.service';
import { AuthService } from 'src/app/services/auth.service';
import { WelcomeService } from 'src/app/services/welcome.service';
import { Profile } from 'src/app/interfaces/profile';
import { SharedStoreService } from 'src/app/services/shared-store.service';
import { FileStorageService } from 'src/app/services/file-storage.service';

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

  @Input() reauthenticate = false;
  @Output() processDone = new EventEmitter();

  phoneNumber = new PhoneNumber();
  appVerifier: any;
  verificationCode: string;
  confirmationResult: firebase.auth.ConfirmationResult;
  telInputObj: any
  phoneError = 'no errors';
  isPhoneError = false;
  verificationError = 'no errors';
  isVerificationError = false;
  isVerifyButtonDisabled = false;
  isContinueButtonDisabled = false;
  countryCode = this.sharedService.defaultPhoneCountryCode || this.sharedService.INITIAL_PHONE_COUNTRY_CODE;

  constructor(private afAuth: AngularFireAuth,
    private cd: ChangeDetectorRef,
    private sharedService: SharedService,
    private authService: AuthService,
    private welcomeService: WelcomeService,
    private sharedStoreService: SharedStoreService,
    private fileStorageService: FileStorageService) { }

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

    this.afAuth.signInWithPhoneNumber(this.phoneNumber.line, this.appVerifier)
      .then(result => {
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
      }
    }, app);
  }

  async verifyLoginCode() {
    this.isVerificationError = false;
    this.verificationError = 'no errors';
    if (!this.confirmationResult) {
      return;
    }
    if (!this.verificationCode) {
      this.isVerificationError = true;
      this.verificationError = 'Please Enter Your Verification Code';
      return;
    }

    this.isVerifyButtonDisabled = true;
    try {
      const confirm = await this.confirmationResult.confirm(this.verificationCode);
      if (this.reauthenticate) {
        this.processDone.next({userCredential: confirm});
      } else {
        const info = this.welcomeService.basicInfo;
        info.mobile = this.phoneNumber.line;
        const isNewUser = confirm.additionalUserInfo.isNewUser;
        if (isNewUser) {
          const profile: Profile = {
            user_id: confirm.user.uid,
            basicInfo: info,
            timestamp: this.sharedStoreService.timestamp,
            fcmTokens: [],
            settings: {
              notifications: false
            }
          }
          await this.welcomeService.registerAndUpdate(profile);
        } else {
          this.processDone.next({disableBackButton: true});
        }
      }
    } catch (error) {
      this.isVerificationError = true;
      this.verificationError = 'Wrong Verification Code';
      this.isVerifyButtonDisabled = false;
      this.markForCheck();
      console.error(error);
    }
  }

  getAndVerifyNumber(): boolean {
    try {
      const isValid = this.telInputObj.isValidNumber();
      this.phoneNumber.line = this.telInputObj.getNumber();
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
  }

  setVerificationInput(event) {
    this.verificationCode = event.detail.value;
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
