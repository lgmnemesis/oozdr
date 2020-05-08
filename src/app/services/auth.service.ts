import { Injectable } from '@angular/core';
import { BehaviorSubject, Subscription, Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import { environment } from '../../environments/environment';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { SharedStoreService } from './shared-store.service';
import { take } from 'rxjs/operators';

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

  constructor(private afAuth: AngularFireAuth,
    private alertCtrl: AlertController,
    private router: Router,
    private sharedStoreService: SharedStoreService) { }

  init() {
    this.subscribeUser();
    this.signingOut$.subscribe((isSiningOut) => {
      if (isSiningOut) {
        this.signOutInternal();
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
    this.userSubject.next(undefined);
    try {
      await this.afAuth.signOut();
      this.sharedStoreService.resetStore();
      await this.router.navigate(['/']);
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
    const alert = await this.alertCtrl.create({
      header: 'Are you sure you want to log out?',
      mode: 'ios',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            this.inLogoutProcess = false;
          }
        }, {
          text: 'Log out',
          handler: () => {
            this.signOut();
          }
        }
      ]
    });

    await alert.present();
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
}
