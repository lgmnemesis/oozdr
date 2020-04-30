import { Component, OnInit, ChangeDetectionStrategy, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { SignInModalComponent } from 'src/app/components/sign-in-modal/sign-in-modal.component';
import { AuthService } from 'src/app/services/auth.service';
import { Subscription } from 'rxjs';
import { SharedStoreService } from 'src/app/services/shared-store.service';
import { environment } from '../../../environments/environment';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-start',
  templateUrl: './start.page.html',
  styleUrls: ['./start.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StartPage implements OnInit, OnDestroy {

  private isSignInButtonActive = false;
  shouldAnimate = this.sharedStoreService.shouldAnimateStartPage;
  _user: Subscription;
  canShowPage = false;
  isLoggedIn = false;
  testAuthForProduction = false; // temp for now
  isProduction = false; // temp for now

  constructor(private modalCtrl: ModalController,
    private sharedStoreService: SharedStoreService,
    private sharedService: SharedService,
    private authService: AuthService,
    private navCtrl: NavController,
    private cd: ChangeDetectorRef) { }

  ngOnInit() {
    // Test auth for production
    this.checkTestAuthForProduction();

    this.sharedStoreService.canEnterWelcome = true;
    this.sharedStoreService.canEnterHome = false;
    this.sharedStoreService.needToFinishInfoRegistration = false;
    this._user = this.authService.user$.subscribe((user) => {
      this.canShowPage = false;
      if (user) {
        this.isLoggedIn = true;
        this.canShowPage = false;
        this.sharedStoreService.registerToProfile(user.user_id);
        if (user.display_name) {
          this.sharedStoreService.canEnterWelcome = false;
          this.sharedStoreService.canEnterHome = true;
          this.gotoHome();
        } else {
          this.sharedStoreService.needToFinishInfoRegistration = true;
          this.gotoWelcome();
        }
      } else if (user === null) {
        this.canShowPage = true;
      }
      this.markForCheck();
    })
  }

  checkTestAuthForProduction() {
    if (environment.production) {
      this.isProduction = true;
    } else {
      this.testAuthForProduction = true;
    }
    this.markForCheck();
  }

  testAuthForProductionInput(event) {
    if (event.detail.value === '12gin21') {
      this.testAuthForProduction = true;
      this.markForCheck();
    }
  }

  markForCheck() {
    this.cd.markForCheck();
  }

  gotoHome() {
    this.goto('/connections');
  }

  gotoWelcome() {
    this.goto('/welcome');
  }

  goto(url) {
    this.navCtrl.navigateRoot(url)
    .catch((error) => {
      console.error(error);
    });
  }

  signIn() {
    if (!this.isSignInButtonActive) {
      this.isSignInButtonActive = true;
      this.sharedService.setDefaultPhoneCountryCode();
      this.presentSignIn();
    }
  }

  async presentSignIn() {
    const modal = await this.modalCtrl.create({
      component: SignInModalComponent,
      backdropDismiss: false,
      cssClass: 'present-modal-properties'
    });

    modal.onDidDismiss().finally(() => {
      this.isSignInButtonActive = false;
    })
    return await modal.present();
  }

  signUp() {
    this.disableAnimation();
  }

  disableAnimation() {
    this.sharedStoreService.shouldAnimateStartPage = false;
    this.shouldAnimate = false;
  }

  ngOnDestroy() {
    if (this._user) {
      this._user.unsubscribe();
    }
  }
}
