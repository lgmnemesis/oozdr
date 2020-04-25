import { Component, OnInit, ChangeDetectionStrategy, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { SignInModalComponent } from 'src/app/components/sign-in-modal/sign-in-modal.component';
import { SharedService } from 'src/app/services/shared.service';
import { AuthService } from 'src/app/services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-start',
  templateUrl: './start.page.html',
  styleUrls: ['./start.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StartPage implements OnInit, OnDestroy {

  private isSignInButtonActive = false;
  shouldAnimate = this.sharedService.shouldAnimateStartPage;
  _user: Subscription;
  canShowPage = false;

  constructor(private modalCtrl: ModalController,
    private sharedService: SharedService,
    private authService: AuthService,
    private navCtrl: NavController,
    private cd: ChangeDetectorRef) { }

  ngOnInit() {
    this.sharedService.canEnterWelcome = true;
    this.sharedService.canEnterHome = false;
    this._user = this.authService.getUser().subscribe((user) => {
      console.log('moshe start:', user);
      this.canShowPage = true;
      if (user) {
        this.canShowPage = false;
        this.sharedService.canEnterWelcome = false;
        this.sharedService.canEnterHome = true;
        this.gotoHome();
      }
      this.markForCheck();
    })
  }

  markForCheck() {
    this.cd.markForCheck();
  }

  gotoHome() {
    this.navCtrl.navigateRoot('/home')
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
    this.sharedService.shouldAnimateStartPage = false;
    this.shouldAnimate = false;
  }

  ngOnDestroy() {
    console.log('moshe start on destroy');
    if (this._user) {
      this._user.unsubscribe();
    }
  }
}
