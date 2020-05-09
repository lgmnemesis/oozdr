import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef, Input } from '@angular/core';
import { SharedService } from 'src/app/services/shared.service';
import { SharedStoreService } from 'src/app/services/shared-store.service';
import { Connection } from 'src/app/interfaces/profile';
import { ToastMessage } from 'src/app/interfaces/toast-message';

export class Q {
  name = '';
  phoneNumber = '';
  letThemKnow = false;  
}

@Component({
  selector: 'app-manage-connection',
  templateUrl: './manage-connection.component.html',
  styleUrls: ['./manage-connection.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ManageConnectionComponent implements OnInit, OnDestroy {

  @Input() action: 'add' | 'edit' = null;

  Q = new Q();
  isNameError = false;
  nameError = 'no errors';
  telInputObj: any
  phoneError = 'no errors';
  isPhoneError = false;
  countryCode = this.sharedService.defaultPhoneCountryCode || this.sharedService.INITIAL_PHONE_COUNTRY_CODE;

  constructor(private sharedService: SharedService,
    private cd: ChangeDetectorRef,
    private sharedStoreService: SharedStoreService) { }

  ngOnInit() {
  }

  markForCheck() {
    this.cd.markForCheck();
  }

  setName(event) {
    this.Q.name = event.detail.value;
    this.isValidName();
  }

  isValidName(): boolean {
    this.nameError = 'no errors';
    this.isNameError = false;
    const name = this.Q.name.trim();
    if (!name) {
      this.nameError = 'Please Enter a Valid Name';
      this.isNameError = true;      
    } else if (!name.match(/^[\u0590-\u05FF\w ]+$/)) {
      this.nameError = 'Only Letters please';
      this.isNameError = true;
    } else if (name.length < 2) {
      this.nameError = 'Sorry, name is too short';
      this.isNameError = true;
    }
    return !this.isNameError;
  }

  getAndVerifyNumber(): boolean {
    try {
      const isValid = this.telInputObj.isValidNumber();
      this.Q.phoneNumber = this.telInputObj.getNumber();
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

  toggleLetThemKnow(event) {
    this.Q.letThemKnow = event.detail.value;
  }

  async addConnection() {
    this.isNameError = false;
    this.isPhoneError = false;
    const isValidName = this.isValidName();
    const isValidNumber = this.getAndVerifyNumber();
    if (!isValidNumber) {
      this.phoneError = !this.Q.phoneNumber  ? 'Enter Connection\'s Mobile Number' : 'Invalid Number';
      this.isPhoneError = true;
    }
    if (!isValidName || !isValidNumber) {
      return;
    }
    const profile = await this.sharedStoreService.getProfile();
    const connection: Connection = {
      id: `${profile.user_id}_${this.Q.phoneNumber}`,
      basicInfo: {
        name: this.Q.name,
        mobile: this.Q.phoneNumber,
        birthday: '',
        email: '',
        gender: '',
        profile_img_url: '',
        profile_img_file: ''
      },
      isMatched: false,
      isNewMatch: false,
      match_id: '',
      match_user_id: '',
      user_id: profile.user_id,
      user_mobile: profile.basicInfo.mobile,
      user_profle_img_url: profile.basicInfo.profile_img_url
    }
    this.sharedStoreService.addConnection(connection)
    .then(() => {
      this.sendToastMessage(connection);
    })
    .catch(error => console.error(error));
    this.close();
  }

  sendToastMessage(connection: Connection) {
    const message: ToastMessage = {
      header: `${connection.basicInfo.name} is now a new connection. Great first step!`,
      message: `If ${connection.basicInfo.name} has you as a connection, or will add you in the future, We will update both of you immediately.`,
      id: 'connection_added',
      isVisible: true,
      duration: -1,
      dismissButton: true,
      dismissButtonText: 'got it',
      persistOnDismiss: true
    }
    try {
      const isPers = localStorage.getItem(`${this.sharedService.toastNotificationsStoragePerfix}${message.id}`);
      if (isPers) {
        message.duration = 5000;
        message.dismissButton = true;
        message.dismissButtonText = 'Ok';
        message.persistOnDismiss = false;
      }
    } catch (error) {
      console.error(error);
    }
    this.sharedStoreService.toastNotificationsSubject.next(message);
  }

  close() {
    this.sharedStoreService.connectionsStateSubject.next({state: 'view'});
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