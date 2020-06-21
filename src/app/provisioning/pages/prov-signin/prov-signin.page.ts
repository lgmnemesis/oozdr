import { Component, OnInit } from '@angular/core';
import { ProvAuthService } from '../../services/prov-auth.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-prov-signin',
  templateUrl: './prov-signin.page.html',
  styleUrls: ['./prov-signin.page.scss'],
})
export class ProvSigninPage implements OnInit {

  email = '';
  password = '';

  constructor(private provAuthService: ProvAuthService,
    private navCtrl: NavController) { }

  ngOnInit() {
  }

  inputId(event) {
    this.email = event.detail.value.trim();
  }

  inputPassword(event) {
    this.password = event.detail.value.trim();
  }

  async signIn() {
    try {
      const credential = await this.provAuthService.afAuth.signInWithEmailAndPassword(this.email, this.password);
      if (credential) {
        this.gotoHome();
      }
    } catch (error) {
      console.error(error);
    }
  }

  gotoHome() {
    this.navCtrl.navigateRoot('/prov-start')
    .catch((error) => {
      console.error(error);
    });
  }
}
