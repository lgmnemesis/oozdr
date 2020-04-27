import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { SharedService } from 'src/app/services/shared.service';

export class Q {
  name = '';
  phoneNumber = '';
  letThemKnow = false;  
}

@Component({
  selector: 'app-matches',
  templateUrl: './matches.component.html',
  styleUrls: ['./matches.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MatchesComponent implements OnInit, OnDestroy {

  Q = new Q();
  isNameError = false;
  nameError = 'no errors';
  telInputObj: any
  phoneError = 'no errors';
  isPhoneError = false;
  countryCode = this.sharedService.defaultPhoneCountryCode || this.sharedService.INITIAL_PHONE_COUNTRY_CODE;

  constructor(private sharedService: SharedService) { }

  ngOnInit() {}

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
