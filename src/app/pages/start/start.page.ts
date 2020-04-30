import { Component, OnInit, ChangeDetectionStrategy, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { SignInModalComponent } from 'src/app/components/sign-in-modal/sign-in-modal.component';
import { AuthService } from 'src/app/services/auth.service';
import { Subscription } from 'rxjs';
import { SharedStoreService } from 'src/app/services/shared-store.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-start',
  templateUrl: './start.page.html',
  styleUrls: ['./start.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StartPage implements OnInit, OnDestroy {

  private isSignInButtonActive = false;
  shouldAnimate = this.sharedStatesService.shouldAnimateStartPage;
  _user: Subscription;
  canShowPage = false;
  isLoggedIn = false;
  testAuthForProduction = false; // temp for now
  isProduction = false; // temp for now

  constructor(private modalCtrl: ModalController,
    private sharedStatesService: SharedStoreService,
    private authService: AuthService,
    private navCtrl: NavController,
    private cd: ChangeDetectorRef) { }

  ngOnInit() {
    // Test auth for production
    this.checkTestAuthForProduction();

    this.sharedStatesService.canEnterWelcome = true;
    this.sharedStatesService.canEnterHome = false;
    this._user = this.authService.getUser().subscribe((user) => {
      this.canShowPage = true;
      if (user) {
        this.isLoggedIn = true;
        this.canShowPage = false;
        this.sharedStatesService.canEnterWelcome = false;
        this.sharedStatesService.canEnterHome = true;
        this.sharedStatesService.registerToProfile(user.uid);
        this.gotoHome();
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
    this.navCtrl.navigateRoot('/connections')
    .catch((error) => {
      console.error(error);
    });
  }

  signIn() {
    if (!this.isSignInButtonActive) {
      this.isSignInButtonActive = true;
      this.presentSignUp();
    }
  }

  async presentSignUp() {
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

  disableAnimation() {
    this.sharedStatesService.shouldAnimateStartPage = false;
    this.shouldAnimate = false;
  }

  ngOnDestroy() {
    if (this._user) {
      this._user.unsubscribe();
    }
  }
}
