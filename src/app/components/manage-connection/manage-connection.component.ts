import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef, Input } from '@angular/core';
import { SharedService } from 'src/app/services/shared.service';
import { SharedStoreService } from 'src/app/services/shared-store.service';
import { Connection } from 'src/app/interfaces/profile';

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
    const isValid = this.getAndVerifyNumber();
    if (!isValid) {
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
        profilePhoto: '',
        profilePhotoOrg: ''
      },
      timestamp: this.sharedStoreService.timestamp,
      isMatched: false,
      match_id: '',
      match_user_id: '',
      user_id: profile.user_id,
      user_mobile: profile.basicInfo.mobile
    }
    this.sharedStoreService.addConnection(connection).catch(error => console.error(error));
    this.close();
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