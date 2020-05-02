import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Profile, Connection } from '../interfaces/profile';
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

  private getConnectionsDbRef(userId: string, batchSize = 100): AngularFirestoreCollection<Connection[]> {
    const path = 'connections/';
    return this.afs.collection(path, ref => {
      return ref.where('user_id', '==', userId)
      .limit(batchSize);
    });
  }

  getConnectionsAsObservable(userId: string): Observable<Connection[]> {
    return this.getConnectionsDbRef(userId).valueChanges()
    .pipe(catchError((error) => {
      if (!environment.production) {
        console.error(error);
      }
      return of(null);
    }));
  }

  async addConnection(connection: Connection): Promise<void> {
    const path = 'connections/';
    try {
      return this.afs.collection(path).doc(connection.id).set(connection);
    }
    catch (error) {
      return console.error(error);
    }
  }

  async removeConnection(connection: Connection): Promise<void> {
    const path = 'connections/';
    try {
      return this.afs.collection(path).doc(connection.id).delete();
    }
    catch (error) {
      return console.error(error);
    }
  }

  async updateConnectionData(connection: Connection, data: any) {
    const path = 'connections/';
    try {
      return this.afs.collection(path).doc(connection.id).update(data);
    }
    catch (error) {
      return console.error(error);
    }
  }

  createId(): string {
    return this.afs.createId();
  }

  get timestamp(): number {
    return new Date().getTime();
  }
}
