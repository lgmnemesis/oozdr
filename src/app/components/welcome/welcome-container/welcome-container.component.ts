import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { NavController } from '@ionic/angular';
import { SharedStoreService } from 'src/app/services/shared-store.service';
import { AuthService } from 'src/app/services/auth.service';
import { WelcomeService } from 'src/app/services/welcome.service';
import { Profile } from 'src/app/interfaces/profile';

@Component({
  selector: 'app-welcome-container',
  templateUrl: './welcome-container.component.html',
  styleUrls: ['./welcome-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WelcomeContainerComponent implements OnInit {

  step = 1;
  isBack = false;
  isNext = false;
  disableBackButton = false;

  constructor(private cd: ChangeDetectorRef,
    private navCtrl: NavController,
    public sharedStoreService: SharedStoreService,
    private authService: AuthService,
    private welcomeService: WelcomeService) { }

  ngOnInit() {
  }

  markForCheck() {
    this.cd.markForCheck();
  }

  logout() {
    this.authService.logout();
  }

  back() {
    this.step--;
    this.isBack = true;
    this.isNext = false;
    if (this.step < 1) {
      // goto start
      this.gotoStart();
    }
    this.welcomeService.isDisableNextButton = false;
    this.markForCheck();
  }

  next() {
    if (this.sharedStoreService.needToFinishInfoRegistration) {
      this.finishInfoRegistration();
      return;
    }
  
    this.step++;
    this.isBack = false;
    this.isNext = true;
    this.markForCheck();
  }

  gotoStart() {
    this.navCtrl.navigateRoot('/start')
    .catch((error) => {
      console.error(error);
    });
  }

  async finishInfoRegistration() {
    const info = this.welcomeService.basicInfo;
    const user = await this.authService.getUser();
    if (user) {
      delete info.mobile; // already created at first registration
      const profile: Profile = {
        user_id: user.uid,
        basicInfo: info,
        timestamp: this.sharedStoreService.timestamp
      }

      await this.welcomeService.registerAndUpdate(profile);
      this.gotoStart();
    }
  }

  processDone(event) {
    this.disableBackButton = true;
    this.markForCheck();
  }
}
