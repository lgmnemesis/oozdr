import { Component, OnInit, ChangeDetectionStrategy, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ModalController, NavController, PopoverController } from '@ionic/angular';
import { SignInModalComponent } from 'src/app/components/sign-in-modal/sign-in-modal.component';
import { AuthService } from 'src/app/services/auth.service';
import { Subscription, Observable, of } from 'rxjs';
import { SharedStoreService } from 'src/app/services/shared-store.service';
import { SharedService } from 'src/app/services/shared.service';
import { WelcomeService } from 'src/app/services/welcome.service';
import { Profile } from 'src/app/interfaces/profile';
import { switchMap } from 'rxjs/operators';
import { SiteFooterModalComponent } from 'src/app/components/site-footer-modal/site-footer-modal.component';
import { AnalyticsService } from 'src/app/services/analytics.service';
import { AlertsService } from 'src/app/services/alerts.service';

@Component({
  selector: 'app-start',
  templateUrl: './start.page.html',
  styleUrls: ['./start.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StartPage implements OnInit, OnDestroy {

  private isSignInButtonActive = false;
  _profile: Subscription;
  _installAsAppState: Subscription;
  profile$: Observable<Profile>;
  canShowPage = false;
  showMobileStartPage = false;
  isLoggedIn = false;
  isSiteMenuActive = false;
  canShowInstallApp = false;
  observer: IntersectionObserver;

  constructor(private modalCtrl: ModalController,
    public sharedStoreService: SharedStoreService,
    private sharedService: SharedService,
    private authService: AuthService,
    private navCtrl: NavController,
    private cd: ChangeDetectorRef,
    private welcomeService: WelcomeService,
    private popoverCtrl: PopoverController,
    private analyticsService: AnalyticsService,
    private alertsService: AlertsService) { }

  ngOnInit() {
    this._installAsAppState = this.sharedStoreService.installAsAppState$.subscribe((state) => {
      this.canShowInstallApp = false;
      if (state && !state.isInstalled && state.canInstall) {
        this.canShowInstallApp = true;
      }
      this.markForCheck();
    })

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
          this.showMobileStartPage = this.sharedService.isPwaMode();
          setTimeout(() => {
            this.observeAndTriggerScrollAnimation();
          }, 0);
            this.sharedStoreService.loadingAppSubject.next(false);
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
    setTimeout(() => {
      this.unobserveScrollAnimation();
    }, 5000);
    this.goto('/connections');
  }

  gotoWelcome() {
    this.goto('/welcome');
  }

  gotoSupport() {
    this.navCtrl.navigateForward('/support').catch(error => console.error(error));
  }
  
  goto(url) {
    this.navCtrl.navigateRoot(url)
    .then(() => {
      this.sharedStoreService.loadingAppSubject.next(false);
    })
    .catch((error) => {
      console.error(error);
    });
  }

  openSiteMenu(event) {
    if (!this.isSiteMenuActive) {
      this.isSiteMenuActive = true;
      this.presentSiteMenu(event);
    }
  }

  async presentSiteMenu(event) {
    const modal = await this.popoverCtrl.create({
      component: SiteFooterModalComponent,
      event: event,
      cssClass: 'site-footer-popover'
    });

    modal.onDidDismiss().finally(() => {
      this.isSiteMenuActive = false;
    })
    this.analyticsService.siteMenuEvent();
    return await modal.present();
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

  installAsApp() {
    this.alertsService.promptForPwaInstallation();
  }

  unobserveScrollAnimation() {
    try {
      if (this.observer) this.observer.disconnect();
    } catch (error) {
      console.error(error);
    }
  }

  observeAndTriggerScrollAnimation() {
    let delay = 0;
    try {
      this.observer = new IntersectionObserver((entries, observer) => { 
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;

          if (entry.intersectionRatio >= 0) {
            const id = entry.target.id;
            let className = '';
            if (id === 'scroll1' || id === 'scroll5') {
              className = 'slideInLeftTint';
            } else if (id === 'scroll2' || id === 'scroll4' || id === 'scroll6') {
              className = "fadeInUpTint";
            } else if (id === 'scroll3') {
              className = "slideInRightTint";
            }
            
            if (delay > 0) {
              const tDelay = delay;
              delay = 0;
              setTimeout(() => {
                this.runAnimation(entry, className, observer);  
              }, tDelay);
            } else {
              this.runAnimation(entry, className, observer);
            }
          }
        });
      }, { threshold: [0.1] });
      
      const animatedSections = document.querySelectorAll(".scroll-animation");
      animatedSections.forEach(section => {
        this.observer.observe(section);
      })
    } catch (error) {
     console.error(error); 
    }
  }

  runAnimation(entry: IntersectionObserverEntry, className: string, observer: IntersectionObserver) {
    entry.target.classList.toggle(className);
    entry.target.classList.remove('hide');
    observer.unobserve(entry.target);
    this.markForCheck();
  }

  ngOnDestroy() {
    if (this._profile) {
      this._profile.unsubscribe();
    }
    if (this._installAsAppState) {
      this._installAsAppState.unsubscribe();
    }
    this.unobserveScrollAnimation();
  }
}
