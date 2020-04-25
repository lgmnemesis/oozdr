import { Injectable } from '@angular/core';
import { BehaviorSubject, Subscription, Observable, of, timer } from 'rxjs';
import { retryWhen, delayWhen, take, switchMap, tap, first } from 'rxjs/operators';
import { User } from '../interfaces/user';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { environment } from '../../environments/environment';

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

  constructor(private afAuth: AngularFireAuth,
    private afs: AngularFirestore) { }

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
          console.log('moshe1: userid:', user.uid);
          return this.afs.doc<User>(`users/${user.uid}`).valueChanges()
          .pipe(
            retryWhen(errors => {
              return errors.pipe(
                tap((er) => console.log('moshe er:', er)),
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
        console.log('moshe in user sub:', user);
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
        console.log('moshe in update 2:', data);
        return this.afs.doc(userDoc).set(data, {merge: true});
      }
    }

    unsubscribeUser() {
      if (this._userInternal) {
        this._userInternal.unsubscribe();
      }
    }
  
    async signOut() {
      await this.afAuth.signOut().catch((error => console.error(error)));
      this.unsubscribeUser();
    }

    getUser(): Observable<firebase.User> {
      return this.afAuth.user;
    }
}
