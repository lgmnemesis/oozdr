import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Profile } from '../interfaces/profile';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  constructor(private afs: AngularFirestore) { }

  getProfileAsObservable(userId: string): Observable<Profile> {
    const path = 'profiles/' + userId;
    return this.afs.doc(path).valueChanges()
    .pipe(catchError((error) => {
      if (!environment.production) {
        console.error(error);
      }
      return of(null);
    }));
  }

  updateProfile(profile: Profile): Promise<void> {
    const path = 'profiles/';
    profile.timestamp = this.timestamp;
    return this.afs.collection(path).doc(profile.user_id).set(profile, { merge: true });
  }

  createId(): string {
    return this.afs.createId();
  }

  get timestamp(): number {
    return new Date().getTime();
  }
}
