import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef, Input } from '@angular/core';
import { SharedService } from 'src/app/services/shared.service';
import { SharedStoreService } from 'src/app/services/shared-store.service';
import { Connection, Profile } from 'src/app/interfaces/profile';
import { ToastMessage } from 'src/app/interfaces/toast-message';
import { ConnectionsState } from 'src/app/interfaces/connections-state';

export class Q {
  name = '';
  phoneNumber = '';
  welcomeMessage = '';  
}

@Component({
  selector: 'app-manage-connection',
  templateUrl: './manage-connection.component.html',
  styleUrls: ['./manage-connection.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ManageConnectionComponent implements OnInit, OnDestroy {

  @Input() 
  set state(s: ConnectionsState) {
    this.connectionState = s;
    this.reset();
    if (s && s.state === 'edit') {
      this.setForEdit(s);
      this.markForCheck();
    }
  }

  Q = new Q();

  isNameError = false;
  nameError = 'no errors';
  phoneError = 'no errors';
  isPhoneError = false;
  showWelcomeMessage = false;
  saveConnectionButtonText = 'Add Connection';
  profile: Profile;

  telInputObj: any
  countryCode = this.sharedService.defaultPhoneCountryCode || this.sharedService.INITIAL_PHONE_COUNTRY_CODE;
  connectionState: ConnectionsState;

  constructor(private sharedService: SharedService,
    private cd: ChangeDetectorRef,
    private sharedStoreService: SharedStoreService) { }

  ngOnInit() {
    this.getProfile();
  }

  markForCheck() {
    this.cd.markForCheck();
  }

  reset() {
    this.Q.name = '';
    this.Q.phoneNumber = '',
    this.Q.welcomeMessage = '';

    this.isNameError = false;
    this.nameError = 'no errors';
    this.phoneError = 'no errors';
    this.isPhoneError = false;
    this.showWelcomeMessage = false;
    this.saveConnectionButtonText = 'Add Connection';
  }

  async getProfile() {
    this.profile = await this.sharedStoreService.getProfile();
  }

  setForEdit(connectionState: ConnectionsState) {
    console.log('in edit');
    const connection = connectionState.connection;
    this.Q.name = connection.basicInfo.name;
    this.Q.phoneNumber = connection.basicInfo.mobile;
    this.Q.welcomeMessage = connection.basicInfo.welcome_msg;
    if (this.Q.welcomeMessage) {
      this.showWelcomeMessage = true;
    }
    this.saveConnectionButtonText = 'Save Connection';
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
    if (this.connectionState && this.connectionState.state === 'edit' && obj) {
      try {
        this.telInputObj.setNumber(this.Q.phoneNumber);
      } catch (error) {
        console.error(error);
      }
    }
  }

  telHasError(event) {
  }

  toggleWelcomeMessage(event) {
    this.showWelcomeMessage = event.detail.checked;
  }

  setWelcomeMessage(event) {
    this.Q.welcomeMessage = event.detail.value;
  }

  addOrSaveConnection() {
    if (this.connectionState && this.connectionState.state === 'add') {
      this.addConnection();
    } else if (this.connectionState && this.connectionState.state === 'edit') {
      this.saveConnection();
    }
  }

  saveConnection() {
    const valid = this.validateConnection();
    if (!valid) {
      return false;
    }
    const connection = this.connectionState.connection;
    const clone = JSON.parse(JSON.stringify(connection));

    connection.basicInfo.name = this.Q.name;
    connection.basicInfo.mobile = this.Q.phoneNumber;
    connection.basicInfo.welcome_msg = this.Q.welcomeMessage;
    if (!this.showWelcomeMessage) {
      connection.basicInfo.welcome_msg = '';
    }

    if (JSON.stringify(clone) !== JSON.stringify(connection)) {
      const data = {
        basicInfo: connection.basicInfo
      }
      this.sharedStoreService.updateConnectionData(connection, data);
    }
    this.close();
  }

  async addConnection() {
    const valid = this.validateConnection();
    if (!valid) {
      return false;
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
        profile_img_file: '',
        welcome_msg: this.Q.welcomeMessage
      },
      isMatched: false,
      isNewMatch: false,
      match_id: '',
      match_user_id: '',
      user_name: profile.basicInfo.name,
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

  validateConnection(): boolean {
    this.isNameError = false;
    this.isPhoneError = false;
    const isValidName = this.isValidName();
    const isValidNumber = this.getAndVerifyNumber();
    const isUsingOwnNuber = this.profile.basicInfo.mobile === this.Q.phoneNumber;
    if (!isValidNumber || isUsingOwnNuber) {
      this.phoneError = !this.Q.phoneNumber  ? 'Enter Connection\'s Mobile Number' : 
      isUsingOwnNuber ? 'Can\'t use your own mumber' : 'Invalid Number';
      this.isPhoneError = true;
    }
    if (!isValidName || !isValidNumber || isUsingOwnNuber) {
      return false;
    }
    return true;
  }

  sendToastMessage(connection: Connection) {
    const message: ToastMessage = {
      header: `${connection.basicInfo.name} is now a new connection. Great first step!`,
      message: `If ${connection.basicInfo.name} has you as a connection, or will add you in the future, We will update both of you immediately.`,
      type: 'connection_added',
      id: connection.id,
      isVisible: true,
      duration: -1,
      dismissButton: true,
      dismissButtonText: 'got it',
      persistOnDismiss: true
    }
    try {
      const isPers = localStorage.getItem(`${this.sharedService.toastNotificationsStoragePerfix}${message.type}`);
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