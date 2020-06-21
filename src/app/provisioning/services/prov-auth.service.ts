import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { BehaviorSubject, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProvAuthService {

  private userSubject: BehaviorSubject<firebase.User> = new BehaviorSubject(undefined);
  user$ = this.userSubject.asObservable();
  private _authUser: Subscription;
  private signingOutSubject: BehaviorSubject<boolean> = new BehaviorSubject(false);
  signingOut$ = this.signingOutSubject.asObservable();

  constructor(public afAuth: AngularFireAuth) { }

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
      this.userSubject.next(user);
      if (user) {

      }
    });
  }

  private unsubscribeUser() {
    if (this._authUser) {
      this._authUser.unsubscribe();
    }
    this.userSubject.next(undefined);
  }

  signOut() {
    this.signingOutSubject.next(true);
  }

  getUser(): Promise<firebase.User> {
    return this.user$.pipe(take(1)).toPromise();
  }

  private signOutInternal() {}
}
