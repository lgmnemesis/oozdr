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

  signOut() {
    this.sharedStoreService.needToFinishInfoRegistration = false;
    this.welcomeService.deleteInfoFromStore();
    this.authService.signOut();
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

  finishInfoRegistration() {
    const info = this.welcomeService.getInfo();
    const user = this.authService.getUser();
    if (user) {
      user.display_name = info.name;
      user.email = info.email;

      const profile: Profile = {
        user_id: user.user_id,
        basicInfo: info,
        connections: [],
        timestamp: this.sharedStoreService.timestamp
      }
      this.authService.updateUserData(user, false).catch((error) => { console.error(error)});
      this.sharedStoreService.updateProfile(profile).then(() => {
        this.sharedStoreService.registerToProfile(profile.user_id).catch(error => console.error(error));
        this.gotoStart();
      }).catch(error => console.error(error));
    }
  }
}
