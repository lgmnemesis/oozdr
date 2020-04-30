import { Injectable } from '@angular/core';
import { BehaviorSubject, Subscription, Observable, of, timer } from 'rxjs';
import { retryWhen, delayWhen, take, switchMap, first } from 'rxjs/operators';
import { User } from '../interfaces/user';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { environment } from '../../environments/environment';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { SharedStoreService } from './shared-store.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  userSubject: BehaviorSubject<User> = new BehaviorSubject(undefined);
  user$ = this.userSubject.asObservable();
  private userInternal$: Observable<User>;
  private _userInternal: Subscription;
  signingOutSubject: BehaviorSubject<boolean> = new BehaviorSubject(false);
  signingOut$ = this.signingOutSubject.asObservable();
  inLogoutProcess = false;

  constructor(private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private alertCtrl: AlertController,
    private router: Router,
    private sharedStoreService: SharedStoreService) { }

  init() {
    this.subscribeUser();
    this.signingOut$.subscribe((isSiningOut) => {
      if (isSiningOut) {
        this.signOut();
      }
    });
  }

  subscribeUser() {
    this.unsubscribeUser();
    this.userInternal$ = this.afAuth.authState.pipe(switchMap(user => {
      if (!environment.production && user) {
        console.log('[DEBUG] Auth user:', user);
      }
      if (user) {
        return this.afs.doc<User>(`users/${user.uid}`).valueChanges()
        .pipe(
          retryWhen(errors => {
            return errors.pipe(
              take(5),
              delayWhen(() => timer(5000))
            );
          })
        );
      } else {
        return of(null);
      }
    }));

    this._userInternal = this.userInternal$.subscribe((user: User) => {
      this.userSubject.next(user);
    });
  }

  async updateUserData(data: User, onlyIfNotExists = false): Promise<void> {
    const userDoc = `users/${data.user_id}`;

    let userDocExists = false;
    if (onlyIfNotExists) {
      const doc = await this.afs.doc(userDoc).valueChanges().pipe(first())
      .toPromise().catch((error) => {});
      if (doc) {
        userDocExists = true;
      }
    }

    if (userDocExists) {
      return Promise.resolve();
    } else {
      return this.afs.doc(userDoc).set(data, {merge: true});
    }
  }

  unsubscribeUser() {
    if (this._userInternal) {
      this._userInternal.unsubscribe();
    }
  }

  async signOut() {
    this.afAuth.signOut()
    .then(() => {
      this.sharedStoreService.resetStore();
      this.router.navigate(['/'])
      .then(() => {
        this.inLogoutProcess = false;
      })
      .catch((error => {
        console.error(error);
        this.inLogoutProcess = false;
      }));
    })
    .catch((error => {
      console.error(error);
      this.inLogoutProcess = false;
    }));
    
    this.unsubscribeUser();
  }

  getUser(): Observable<firebase.User> {
    return this.afAuth.user;
  }

  async presentLogoutConfirm() {
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
