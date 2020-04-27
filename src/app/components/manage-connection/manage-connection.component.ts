import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { SharedService } from 'src/app/services/shared.service';
import { SharedStatesService } from 'src/app/services/shared-states.service';

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

  Q = new Q();
  isNameError = false;
  nameError = 'no errors';
  telInputObj: any
  phoneError = 'no errors';
  isPhoneError = false;
  countryCode = this.sharedService.defaultPhoneCountryCode || this.sharedService.INITIAL_PHONE_COUNTRY_CODE;

  constructor(private sharedService: SharedService,
    private cd: ChangeDetectorRef,
    private sharedStateService: SharedStatesService) { }

  ngOnInit() {}

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
    console.log('telHasError:', event);
    console.log('detailed error:', this.telInputObj.getValidationError());
  }

  toggleLetThemKnow(event) {
    console.log(event);
    this.Q.letThemKnow = event.detail.value;
  }

  addConnection() {

  }

  close() {
    this.sharedStateService.connectionsStateSubject.next({state: 'view'});
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