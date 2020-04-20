import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { SignInModalComponent } from 'src/app/components/sign-in-modal/sign-in-modal.component';

@Component({
  selector: 'app-start',
  templateUrl: './start.page.html',
  styleUrls: ['./start.page.scss'],
})
export class StartPage implements OnInit {

  private isSignUpButtonActive = false;

  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {
  }

  signUp() {
    if (!this.isSignUpButtonActive) {
      this.isSignUpButtonActive = true;
      this.presentSignUp();
    }
  }

  async presentSignUp() {
    const modal = await this.modalCtrl.create({
      component: SignInModalComponent,
      componentProps: {
        'firstName': 'Douglas',
        'lastName': 'Adams',
        'middleInitial': 'N'
      },
      cssClass: 'present-modal-properties'
    });

    modal.onDidDismiss().finally(() => {
      this.isSignUpButtonActive = false;
      console.log('dismiss:');
    })
    return await modal.present();
  }

}
