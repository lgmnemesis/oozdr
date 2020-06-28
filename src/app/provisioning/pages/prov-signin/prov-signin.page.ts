import { Component, OnInit, OnDestroy, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { ProvAuthService } from '../../services/prov-auth.service';
import { NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-prov-signin',
  templateUrl: './prov-signin.page.html',
  styleUrls: ['./prov-signin.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProvSigninPage implements OnInit, OnDestroy {

  email = '';
  password = '';
  _user: Subscription;
  canShow = false;

  constructor(private provAuthService: ProvAuthService,
    private navCtrl: NavController,
    private cd: ChangeDetectorRef) { }

  ngOnInit() {
    this._user = this.provAuthService.user$.subscribe((user) => {
      if (user) {
        this.gotoHome();
      } else if (user === null) {
        this.canShow = true;
        this.markForCheck();
      }
    })
  }

  markForCheck() {
    this.cd.markForCheck();
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
        // this.gotoHome(); // dont need to do anything here
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

  ngOnDestroy() {
    if (this._user) this._user.unsubscribe();
  }
}
