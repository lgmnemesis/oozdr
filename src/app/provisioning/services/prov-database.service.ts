import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Profile, Connection } from 'src/app/interfaces/profile';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProvDatabaseService {

  constructor(private afs: AngularFirestore) { }

  private getProfilesDbRef(batchSize = 100): AngularFirestoreCollection<Profile[]> {
    const path = 'profiles/';
    return this.afs.collection(path, ref => {
      return ref.orderBy('timestamp', 'desc')
      .limit(batchSize);
    });
  }

  getProfilesAsObservable(batch = 100): Observable<Profile[]> {
    return this.getProfilesDbRef(batch).valueChanges()
    .pipe(catchError((error) => {
      if (!environment.production) {
        console.error(error);
      }
      return of(null);
    }));
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
}
