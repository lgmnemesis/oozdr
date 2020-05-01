import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Profile, Connection, Connections } from '../interfaces/profile';
import * as firebase from 'firebase/app'; 
import 'firebase/firestore';

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

  getConnectionsAsObservable(userId: string): Observable<Connections> {
    const path = 'connections/' + userId;
    return this.afs.doc(path).valueChanges()
    .pipe(catchError((error) => {
      if (!environment.production) {
        console.error(error);
      }
      return of(null);
    }));
  }

  updateConnections(connections: Connections): Promise<void> {
    const path = 'connections/';
    return this.afs.collection(path).doc(connections.user_id).set(connections, { merge: true });
  }

  addConnection(userId: string, connection: Connection): Promise<void> {
    const path = 'connections/';
    return this.afs.collection(path).doc(userId)
      .update({connections: firebase.firestore.FieldValue.arrayUnion(connection)});
  }

  removeConnection(userId: string, connection: Connection): Promise<void> {
    const path = 'connections/';
    return this.afs.collection(path).doc(userId)
      .update({connections: firebase.firestore.FieldValue.arrayRemove(connection)});
  }

  createId(): string {
    return this.afs.createId();
  }

  get timestamp(): number {
    return new Date().getTime();
  }
}
