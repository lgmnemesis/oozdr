import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { SignInModalComponent } from 'src/app/components/sign-in-modal/sign-in-modal.component';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-start',
  templateUrl: './start.page.html',
  styleUrls: ['./start.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StartPage implements OnInit {

  shouldAnimate = this.sharedService.shouldAnimateStartPage;
  private isSignInButtonActive = false;

  constructor(private modalCtrl: ModalController,
    private sharedService: SharedService) { }

  ngOnInit() {
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

}
