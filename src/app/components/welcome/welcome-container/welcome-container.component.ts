import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { NavController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-welcome-container',
  templateUrl: './welcome-container.component.html',
  styleUrls: ['./welcome-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WelcomeContainerComponent implements OnInit {

  step = 2;
  isBack = false;
  isNext = false;

  constructor(private cd: ChangeDetectorRef,
    private navCtrl: NavController,
    private httpClient: HttpClient,
    public sharedService: SharedService) { }

  ngOnInit() {
    this.setDefaultPhoneCountryCode();
  }

  markForCheck() {
    this.cd.markForCheck();
  }

  setDefaultPhoneCountryCode() {
    if (this.sharedService.defaultPhoneCountryCode) {
      return;
    }
    // First, Check if exists in local storage and get it
    try {
      const store = localStorage.getItem('country_code');
      if (store) {
        this.sharedService.defaultPhoneCountryCode = store;
        console.log('moshe: got countryCode from store:', store);
        return;
      }
    } catch (error) {
      console.error(error);
    }
    const json = this.httpClient.request('GET', this.sharedService.ipInfoUrl, {responseType:'json'});
    json.toPromise()
      .then((res) => {
        console.log('moshe:', res);
        // this.sharedService.defaultPhoneCountryCode = res.
        // Save code to local storage
        try {
          // localStorage.setItem('country_code', '');
        } catch (error) {
          console.error(error);
        }
      })
      .catch(error => { 
        console.error(error);
        this.sharedService.defaultPhoneCountryCode = this.sharedService.INITIAL_PHONE_COUNTRY_CODE;
      });
  }

  back() {
    this.step--;
    this.isBack = true;
    this.isNext = false;
    if (this.step < 1) {
      // goto start
      this.gotoStart();
    }
    this.markForCheck();
  }

  next() {
    this.step++;
    this.isBack = false;
    this.isNext = true;
    console.log('moshe next:', this.step);
    this.markForCheck();
  }

  gotoStart() {
    this.navCtrl.navigateRoot('/start')
    .catch((error) => {
      console.error(error);
    });
  }

}
