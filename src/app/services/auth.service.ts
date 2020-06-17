import { Injectable } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import { environment } from '../../environments/environment';
import { AlertController, ModalController, NavController } from '@ionic/angular';
import { SharedStoreService } from './shared-store.service';
import { take } from 'rxjs/operators';
import { DatabaseService } from './database.service';
import { SharedService } from './shared.service';
import { SignInModalComponent } from '../components/sign-in-modal/sign-in-modal.component';
import { AnalyticsService } from './analytics.service';
import { LocaleService } from './locale.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private userSubject: BehaviorSubject<firebase.User> = new BehaviorSubject(undefined);
  user$ = this.userSubject.asObservable();
  private _authUser: Subscription;
  private signingOutSubject: BehaviorSubject<boolean> = new BehaviorSubject(false);
  signingOut$ = this.signingOutSubject.asObservable();
  private inLogoutProcess = false;
  dictionary = this.localeServoce.dictionary;
  dictAuth = this.dictionary.authService;

  constructor(private afAuth: AngularFireAuth,
    private alertCtrl: AlertController,
    private sharedStoreService: SharedStoreService,
    private databaseService: DatabaseService,
    private sharedService: SharedService,
    private modalCtrl: ModalController,
    private navCtrl: NavController,
    private analyticsService: AnalyticsService,
    private localeServoce: LocaleService) { }

  init() {
    this.subscribeUser();
    this.signingOut$.subscribe((isSiningOut) => {
      if (isSiningOut) {
        this.signOutInternal();
      }
    });

    this.sharedStoreService.markForCheckApp$.subscribe((mark) => {
      if (mark) {
        this.dictionary = this.localeServoce.dictionary;
        this.dictAuth = this.dictionary.authService;
      }
    });
  }

  private subscribeUser() {
    this.unsubscribeUser();
    this._authUser = this.afAuth.authState.subscribe(user => {
      if (!environment.production && user) {
        console.log('[DEBUG] Auth user:', user);
      }
      this.userSubject.next(user);
      if (user) {
        this.sharedStoreService.registerToProfile(user.uid);
        this.analyticsService.setUserId(user);
      }
    });
  }

  private unsubscribeUser() {
    if (this._authUser) {
      this._authUser.unsubscribe();
    }
    this.userSubject.next(undefined);
  }

  private signOut() {
    this.signingOutSubject.next(true);
  }

  private async signOutInternal() {
    try {
      const userId = (await this.getUser()).uid;
      this.userSubject.next(undefined);
      this.sharedStoreService.unsubscribe();
      await this.afAuth.signOut();
      this.sharedStoreService.resetStore();
      await this.navCtrl.navigateRoot('/');
      this.analyticsService.logoutEvent(userId);
      this.inLogoutProcess = false;
    } catch (error) {
      console.error(error);
      this.inLogoutProcess = false;
    }
    this.signingOutSubject.next(false);
  }

  getUser(): Promise<firebase.User> {
    return this.user$.pipe(take(1)).toPromise();
  }

  private async presentLogoutConfirm() {
    const message = this.dictAuth.logoutConfirmMessage;
    const buttonText = this.dictAuth.logoutConfirmButton;
    this.presentConfirm(message, buttonText, false, 'signOut');
  }

  private async presentDeleteAccountConfirm() {
    const message = this.dictAuth.deleteAcountConfirmMessage;
    const buttonText = this.dictAuth.deleteAcountConfirmButton;
    this.presentConfirm(message, buttonText, true, 'deleteCurrentUser');
  }

  private async presentConfirm(header: string, buttonText: string, isDangerColor: boolean, action: string) {
    const alert = await this.alertCtrl.create({
      header: header,
      mode: 'ios',
      cssClass: 'alert-confirm-conainer',
      buttons: [
        {
          text: this.dictAuth.cancelBtn,
          role: 'cancel',
          handler: () => {
            this.inLogoutProcess = false;
          }
        }, {
          text: buttonText,
          cssClass: isDangerColor ? 'alert-danger-text-color' : '',
          handler: () => {
            this.confirmAction(action);
          }
        }
      ]
    });

    await alert.present();
  }

  confirmAction(action: string) {
    if (action === 'signOut') {
      this.signOut();
    } else if (action === 'deleteCurrentUser') {
      this.deleteCurrentUser();
    }
  }

  async logout(withConfirmation = true) {
    if (this.inLogoutProcess) {
      return;
    }
    this.inLogoutProcess = true;
    if (withConfirmation) {
      await this.presentLogoutConfirm();
    } else {
      this.signOut();
    }
  }

  async deleteAccount() {
    if (this.inLogoutProcess) {
      return;
    }
    this.inLogoutProcess = true;
    await this.presentDeleteAccountConfirm();
  }

  async deleteCurrentUser() {
    const user = await this.getUser();
    if (user) {
      try {
        await this.reauthenticateWithPopup();
      } catch (error) {
        console.error(error);
      }
    }
  }

  async reauthenticateWithPopup() {
    const modal = await this.modalCtrl.create({
      component: SignInModalComponent,
      backdropDismiss: false,
      cssClass: 'present-modal-properties',
      componentProps: {
        reauthenticate: true
      }
    });

    modal.onWillDismiss()
    .then((res) => {
      if (res && res.data && res.data.userCredential) {
        this.deleteCurrentUserLastStep().catch(error => console.error(error));
      }
    }).catch(error => console.error(error));

    return await modal.present();
  }

  async deleteCurrentUserLastStep() {
    const loader = this.sharedService.presentLoading(this.dictAuth.deleteActionMessage);
    const user = await this.getUser();
    this.databaseService.deleteUserData();
    await user.delete();
    this.sharedStoreService.userDeleted = true;
    this.analyticsService.deleteAccount();
    this.signOut();
    if (loader) {
      setTimeout(() => {
        loader.then((loadRef) => {
          loadRef.dismiss();
          this.inLogoutProcess = false;
        });
      }, 3000);
    }
  }
}
