import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef, Input } from '@angular/core';
import { SharedService } from 'src/app/services/shared.service';
import { SharedStoreService } from 'src/app/services/shared-store.service';
import { Connection, Profile } from 'src/app/interfaces/profile';
import { ToastMessage } from 'src/app/interfaces/toast-message';
import { ConnectionsState } from 'src/app/interfaces/connections-state';

export class Q {
  name = '';
  phoneNumber = '';
  email = '';
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

  @Input() 
  set contacts(c: any[]) {
    this.setContacts(c);
  }

  Q = new Q();

  internalContact = null;
  isNameError = false;
  isEmailError = false;
  isPhoneError = false;
  nameError = 'no errors';
  phoneError = 'no errors';
  emailError = 'no errors';
  showWelcomeMessage = false;
  saveConnectionButtonText = 'Add Beat';
  profile: Profile;
  isValidForm = true;
  selectedContactNameValue = -1;
  selectedContactEmailValue = -1;
  selectedContactTelValue = -1;

  telInputObj: any
  countryCode = this.sharedService.defaultPhoneCountryCode || this.sharedService.INITIAL_PHONE_COUNTRY_CODE;
  connectionState: ConnectionsState;

  customSelectOptions: any = {
    header: 'Select one or more',
    cssClass: 'manage-connection-select-option'
  };

  customSelectText = [
    'Hey... Just wondering :)',
    'Hey... After all.. Still thinking about you!',
    'Did it finally... Couldn\'t help it',
    'What do you think about a little chat?',
    'Isn\'t it a pity? to throw it all away?',
    'Passion is momentary, love is enduring'
  ];

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
    this.Q.email = '';
    this.Q.phoneNumber = '',
    this.Q.welcomeMessage = '';

    this.isNameError = false;
    this.nameError = 'no errors';
    this.isEmailError = false;
    this.emailError = 'no errors';
    this.phoneError = 'no errors';
    this.isPhoneError = false;
    this.showWelcomeMessage = false;
    this.saveConnectionButtonText = 'Add Beat';
    this.markForCheck();
  }

  async getProfile() {
    this.profile = await this.sharedStoreService.getProfile();
  }

  setForEdit(connectionState: ConnectionsState) {
    const connection = connectionState.connection;
    this.Q.name = connection.basicInfo.name;
    this.Q.email = connection.basicInfo.email;
    this.Q.phoneNumber = connection.basicInfo.mobile;
    this.Q.welcomeMessage = connection.basicInfo.welcome_msg;
    if (this.Q.welcomeMessage) {
      this.showWelcomeMessage = true;
    }
    this.saveConnectionButtonText = 'Save Beat';
  }

  setContacts(contacts: any[]) {
    if (contacts && contacts.length > 0) {
      const contact = contacts[0];
      this.internalContact = contact;
      if (contact.name && contact.name.length > 0) this.Q.name = contact.name[0];
      if (contact.email && contact.email.length > 0) this.Q.email = contact.email[0];
      if (contact.tel && contact.tel.length > 0) {
        this.Q.phoneNumber = contact.tel[0];
        this.setNumber();
      }
      this.markForCheck();
    }
  }

  selectedContactName(event) {
    const index = event.detail.value;
    if (index >= 0 && this.internalContact 
      && this.internalContact.name 
      && index < this.internalContact.name.length) {
        const name = this.internalContact.name[index];
        this.Q.name = name;
        this.selectedContactNameValue = index;
        this.markForCheck();
    }
  }

  setName(event) {
    this.Q.name = event.detail.value;
    if (this.internalContact && this.internalContact.name) {
      this.selectedContactNameValue = this.internalContact.name.findIndex((n) => n === this.Q.name);
    }
    this.isValidName();
    this.markForCheck();
  }

  selectedContactEmail(event) {
    const index = event.detail.value;
    if (index >= 0 && this.internalContact 
      && this.internalContact.email 
      && index < this.internalContact.email.length) {
        const email = this.internalContact.email[index];
        this.Q.email = email;
        this.selectedContactEmailValue = index;
        this.markForCheck();
    }
  }

  setEmail(event) {
    this.Q.email = event.detail.value;
    if (this.internalContact && this.internalContact.email) {
      this.selectedContactEmailValue = this.internalContact.email.findIndex((e) => e === this.Q.email);
    }
    this.isValidEmail();
    this.markForCheck();
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

  isValidEmail(): boolean {
    this.emailError = 'no errors';
    this.isEmailError = false;
    const email = this.Q.email.trim();
    if (email && !email.match(this.sharedService.mailformat)) {
      this.emailError = 'Invalid email address';
      this.isEmailError = true;
    }
    return !this.isEmailError;
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
    if (this.connectionState && this.connectionState.state === 'edit') {
      this.setNumber();
    }
  }

  setNumber() {
    if (this.telInputObj) {
      try {
        this.telInputObj.setNumber(this.Q.phoneNumber);
        if (this.internalContact && this.internalContact.tel) {
          this.selectedContactTelValue = this.internalContact.tel.findIndex((t) => t === this.Q.phoneNumber);
        }
      } catch (error) {
        console.error(error);
      }
    }
  }

  selectedContactTel(event) {
    const index = event.detail.value;
    if (index >= 0 && this.internalContact 
      && this.internalContact.tel 
      && index < this.internalContact.tel.length) {
        const tel = this.internalContact.tel[index];
        this.Q.phoneNumber = tel;
        this.setNumber();
        this.selectedContactTelValue = index;
        this.markForCheck();
    }
  }

  telHasError(event) {
  }

  toggleWelcomeMessage(event) {
    this.showWelcomeMessage = event.detail.checked;
    this.markForCheck();
  }

  setWelcomeMessage(event) {
    this.Q.welcomeMessage = event.detail.value;
    this.markForCheck();
  }

  addOrSaveConnection() {
    if (this.connectionState && this.connectionState.state === 'add') {
      this.addConnection();
    } else if (this.connectionState && this.connectionState.state === 'edit') {
      this.saveConnection();
    }
  }

  async saveConnection() {
    const valid = await this.validateConnection();
    if (!valid) {
      return false;
    }
    const connection = this.connectionState.connection;
    const clone = JSON.parse(JSON.stringify(connection));

    connection.basicInfo.name = this.Q.name;
    connection.basicInfo.mobile = this.Q.phoneNumber;
    connection.basicInfo.email = this.Q.email;
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
    const valid = await this.validateConnection();
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
        email: this.Q.email,
        gender: '',
        profile_img_url: '',
        profile_img_file: '',
        welcome_msg: this.Q.welcomeMessage
      },
      isMatched: false,
      isNewMatch: false,
      match_id: '',
      match_user_id: '',
      user_id: profile.user_id,
      user_mobile: profile.basicInfo.mobile,
      user_profle_img_url: profile.basicInfo.profile_img_url,
      className: this.randomClassName()
    }
    this.sharedStoreService.addConnection(connection)
    .then(() => {
      this.sendToastMessage(connection);
    })
    .catch(error => console.error(error));
    this.close('added');
  }

  async validateConnection(): Promise<boolean> {
    this.isValidForm = true;
    this.isNameError = false;
    this.isPhoneError = false;
    const isValidName = this.isValidName();
    const isValidEmail = this.isValidEmail();
    const isValidNumber = this.getAndVerifyNumber();
    const isUsingOwnNuber = this.profile.basicInfo.mobile === this.Q.phoneNumber;
    if (!isValidNumber || isUsingOwnNuber) {
      this.phoneError = !this.Q.phoneNumber  ? 'Enter Connection\'s Mobile Number' : 
      isUsingOwnNuber ? 'Can\'t use your own mumber' : 'Invalid Number';
      this.isPhoneError = true;
    }

    if (!isValidName || !isValidEmail || !isValidNumber || isUsingOwnNuber) {
      this.isValidForm = false;
    } else {
      // Check if connection already exists
      const connections = await this.sharedStoreService.getConnections();
      const connectionExists = connections.find((c) => c.basicInfo.mobile === this.Q.phoneNumber);
      if (connectionExists) {
        this.phoneError = `Number belongs to ${connectionExists.basicInfo.name}`;
        this.isPhoneError = true;
        this.isValidForm = false;
      }
    }

    this.markForCheck();
    return this.isValidForm;
  }

  sendToastMessage(connection: Connection) {
    const name = connection.basicInfo.name;
    const cName = name.charAt(0).toUpperCase() + name.slice(1);
    const message: ToastMessage = {
      header: `${cName} is a new beat. Sounds great!`,
      message: `If ${cName} adds you to their beats, it's a groove! and we'll update both of you immediately. Let's make some music together!`,
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

  selectedMessages(event) {
    const selected: any[] = event.detail.value;
    if (selected) {
      if (this.Q.welcomeMessage && this.Q.welcomeMessage.length > 0) {
        this.Q.welcomeMessage += '\n';
      }
      selected.forEach(s => {
        this.Q.welcomeMessage += `${this.customSelectText[s]}\n`;
      });
      this.markForCheck();
    }
  }

  randomClassName() {
    const id = Math.floor(Math.random() * 8) + 1;
    return `bg-${id}`;
  }

  close(action?: string) {
    let state: ConnectionsState;
    if (action === 'added') {
      state = {state: 'view', prevState: 'add'};
    } else {
      state = {state: 'view'};
    }
    this.sharedStoreService.connectionsStateSubject.next(state);
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