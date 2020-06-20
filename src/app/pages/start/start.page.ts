import { Component, OnInit, ChangeDetectionStrategy, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ModalController, PopoverController } from '@ionic/angular';
import { SignInModalComponent } from 'src/app/components/sign-in-modal/sign-in-modal.component';
import { AuthService } from 'src/app/services/auth.service';
import { Subscription } from 'rxjs';
import { SharedStoreService } from 'src/app/services/shared-store.service';
import { SharedService } from 'src/app/services/shared.service';
import { SiteFooterModalComponent } from 'src/app/components/site-footer-modal/site-footer-modal.component';
import { AnalyticsService } from 'src/app/services/analytics.service';
import { AlertsService } from 'src/app/services/alerts.service';
import { WelcomeService } from 'src/app/services/welcome.service';
import { LocaleService } from 'src/app/services/locale.service';

@Component({
  selector: 'app-start',
  templateUrl: './start.page.html',
  styleUrls: ['./start.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StartPage implements OnInit, OnDestroy {

  private isSignInButtonActive = false;
  _user: Subscription;
  _installAsAppState: Subscription;
  _markForCheckApp: Subscription;
  canShowPage = false;
  showMobileStartPage = false;
  isSiteMenuActive = false;
  canShowInstallApp = false;
  observer: IntersectionObserver;
  dictionary = this.localeService.dictionary;
  dictStart = this.dictionary.startPage;
  isRightToLeft = this.localeService.isRightToLeft;

  constructor(private modalCtrl: ModalController,
    public sharedStoreService: SharedStoreService,
    private sharedService: SharedService,
    private authService: AuthService,
    private cd: ChangeDetectorRef,
    private popoverCtrl: PopoverController,
    private analyticsService: AnalyticsService,
    private alertsService: AlertsService,
    public welcomeService: WelcomeService,
    public localeService: LocaleService) { }

  ngOnInit() {
    this._installAsAppState = this.sharedStoreService.installAsAppState$.subscribe((state) => {
      this.canShowInstallApp = false;
      if (state && !state.isInstalled && state.canInstall) {
        this.canShowInstallApp = true;
      }
      this.markForCheck();
    })

    this.navigateAccordingly();

    this._markForCheckApp = this.sharedStoreService.markForCheckApp$.subscribe((mark) => {
      if (mark) {
        this.dictionary = this.localeService.dictionary;
        this.dictStart = this.dictionary.startPage;
        this.isRightToLeft = this.localeService.isRightToLeft;
        if (this.canShowPage) {
          this.unobserveScrollAnimation();
          setTimeout(() => {
            this.observeAndTriggerScrollAnimation();
          }, 0);
        }
        this.markForCheck();
      }
    })
  }

  markForCheck() {
    this.cd.markForCheck();
  }

  navigateAccordingly() {
    this.sharedStoreService.canEnterWelcome = true;
    this.sharedStoreService.canEnterHome = false;
    this.sharedStoreService.needToFinishInfoRegistration = false;
  
    this._user = this.authService.user$.subscribe(user => {
      this.canShowPage = false;
      if (user) {
        this.canShowPage = false;
        try {
          this.modalCtrl.dismiss().catch(error => {});
        } catch (error) {
        }
        setTimeout(() => {
          this.unobserveScrollAnimation();
        }, 5000);
      } else {
        if (user === null) {
          this.canShowPage = true;
          this.showMobileStartPage = this.sharedService.isPwaMode();
          setTimeout(() => {
            this.observeAndTriggerScrollAnimation();
          }, 0);
          this.sharedStoreService.loadingAppSubject.next(false);
          this.sharedService.setDefaultPhoneCountryCode().then(() => {
            this.localeService.updateCanShowToggleLangButton();
            this.markForCheck();
          });
        }
      }
      this.markForCheck();
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

  gotoWelcome() {
    this.welcomeService.gotoWelcome();
    this.analyticsService.joinUsButtonEvent();
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
              className = this.isRightToLeft ? 'slideInRightTint' : 'slideInLeftTint';
            } else if (id === 'scroll2' || id === 'scroll4' || id === 'scroll6') {
              className = "fadeInUpTint";
            } else if (id === 'scroll3') {
              className = this.isRightToLeft ? 'slideInLeftTint' : 'slideInRightTint';
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

  toggleLang() {
    this.localeService.toggleLang();
  }

  runAnimation(entry: IntersectionObserverEntry, className: string, observer: IntersectionObserver) {
    entry.target.classList.toggle(className);
    entry.target.classList.remove('hide');
    observer.unobserve(entry.target);
    this.markForCheck();
  }

  ngOnDestroy() {
    if (this._user) {
      this._user.unsubscribe();
    }
    if (this._installAsAppState) {
      this._installAsAppState.unsubscribe();
    }
    if (this._markForCheckApp) {
      this._markForCheckApp.unsubscribe();
    }
    this.unobserveScrollAnimation();
  }
}
