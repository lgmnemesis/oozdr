import { Component, OnInit, ChangeDetectionStrategy, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { SignInModalComponent } from 'src/app/components/sign-in-modal/sign-in-modal.component';
import { AuthService } from 'src/app/services/auth.service';
import { Subscription, Observable, of } from 'rxjs';
import { SharedStoreService } from 'src/app/services/shared-store.service';
import { environment } from '../../../environments/environment';
import { SharedService } from 'src/app/services/shared.service';
import { WelcomeService } from 'src/app/services/welcome.service';
import { Profile } from 'src/app/interfaces/profile';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-start',
  templateUrl: './start.page.html',
  styleUrls: ['./start.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StartPage implements OnInit, OnDestroy {

  private isSignInButtonActive = false;
  shouldAnimate = this.sharedStoreService.shouldAnimateStartPage;
  _profile: Subscription;
  profile$: Observable<Profile>;
  canShowPage = false;
  isLoggedIn = false;
  testAuthForProduction = false; // temp for now
  isProduction = false; // temp for now

  constructor(private modalCtrl: ModalController,
    public sharedStoreService: SharedStoreService,
    private sharedService: SharedService,
    private authService: AuthService,
    private navCtrl: NavController,
    private cd: ChangeDetectorRef,
    private welcomeService: WelcomeService) { }

  ngOnInit() {
    // Test auth for production
    this.checkTestAuthForProduction();

    this.navigateAccordingly();
  }

  markForCheck() {
    this.cd.markForCheck();
  }

  navigateAccordingly() {
    this.sharedStoreService.canEnterWelcome = true;
    this.sharedStoreService.canEnterHome = false;
    this.sharedStoreService.needToFinishInfoRegistration = false;
  
    this.profile$ = this.authService.user$.pipe(switchMap(user => {
      this.canShowPage = false;
      if (user) {
        this.isLoggedIn = true;
        this.canShowPage = false;
        try {
          this.modalCtrl.dismiss().catch(error => {});
        } catch (error) {
        }
        this.sharedStoreService.registerToProfile(user.uid);
        return this.sharedStoreService.profile$;
      } else {
        if (user === null) {
          this.canShowPage = true;
          this.sharedService.setDefaultPhoneCountryCode();
        }
        this.markForCheck();
        return of(null);
      }
    }));

    this._profile = this.profile$.subscribe((profile: Profile) => {
      if (profile) {
        if (profile.basicInfo && profile.basicInfo.name) {
          this.gotoHome();
        } else {
          // if there is info object, fill it, update and go home
          const info = this.welcomeService.basicInfo;
          if (info && info.name && info.mobile) {
            const profileJ: Profile = JSON.parse(JSON.stringify(profile));
            profileJ.basicInfo = info;
            this.sharedStoreService.updateProfile(profile).catch(error => console.error(error));
            this.gotoHome();
          } else {
            this.sharedStoreService.needToFinishInfoRegistration = true;
            this.gotoWelcome();
          }
        }
      }
    });
  }

  gotoHome() {
    this.sharedStoreService.canEnterWelcome = false;
    this.sharedStoreService.canEnterHome = true;
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

  ngOnDestroy() {
    if (this._profile) {
      this._profile.unsubscribe();
    }
  }
}
