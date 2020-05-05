import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Profile, Connection, Match, Message } from '../interfaces/profile';
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

  async updateProfile(profile: Profile): Promise<void> {
    const path = 'profiles/';
    profile.timestamp = this.timestamp;
    try {
      return this.afs.collection(path).doc(profile.user_id).set(profile, { merge: true });
    } catch (error) {
      return console.error(error);
    }
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
    const timestamp = this.serverTimestamp;
    try {
      return this.afs.collection(path).doc(connection.id).set({
        ...connection,
        createdAt: timestamp
      });
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

  getMatchAsObservable(id: string): Observable<Match> {
    const path = 'matches/' + id;
    return this.afs.doc(path).valueChanges()
    .pipe(catchError((error) => {
      if (!environment.production) {
        console.error(error);
      }
      return of(null);
    }));
  }

  async addMatchMessage(id: string, message: Message) {
    const path = 'matches/' + id;
    try {
      return this.afs.doc(path).update({ messages: firebase.firestore.FieldValue.arrayUnion(message) });
    } catch (error) {
      return console.error(error);
    }
  }

  createId(): string {
    return this.afs.createId();
  }

  get timestamp(): number {
    return new Date().getTime();
  }

  get serverTimestamp() {
    return firebase.firestore.FieldValue.serverTimestamp();
  }

  async moshe_tmp(connection: Connection) {
    const db = firebase.firestore();

    // Find new connection to work on
    let secondPartyConnection: any = null;
    const connectionsRef = db.collection('connections');
    const query = connectionsRef
      .where('basicInfo.mobile', '==' , connection.user_mobile)
      .where('user_mobile', '==', connection.basicInfo.mobile);
    try {
      const qSnap = await query.get();
      qSnap.forEach((doc) => {
        const docData = doc.data();
        console.log('match1:', docData);
        if (docData.user_id !== connection.user_id) {
          secondPartyConnection = docData;
        }
      });
    } catch (error) {
      console.error("Error getting documents: ", error);
    }

    if (secondPartyConnection) {
      console.log('final match', ' myParty:', connection, ' secondParty:', secondPartyConnection);

      const myConnectionDocRef = db.doc(`connections/${connection.id}`);
      const secondConnectionDocRef = db.doc(`connections/${secondPartyConnection.id}`);
      const matchId = db.collection('matchid').doc().id;
      const matchDocRef = db.doc(`matches/${matchId}`);
      const timestamp = new Date().getTime();
      const myConnectionParams = {
        isMatched: true,
        timestamp: timestamp,
        match_user_id: secondPartyConnection.user_id,
        match_id: matchId
      }
      const secondConnectionParams = {
        isMatched: true,
        timestamp: timestamp,
        match_user_id: connection.user_id,
        match_id: matchId
      }
      const matchParams = {
        id: matchId,
        firstParty: {
          user_id: connection.user_id,
          user_mobile: connection.user_mobile
        },
        secondParty: {
          user_id: secondPartyConnection.user_id,
          user_mobile: secondPartyConnection.user_mobile
        },
        participates: [connection.user_id, secondPartyConnection.user_id],
        messages: []
      }
      console.log('preparing batch write');
      const batch = db.batch();
      batch.set(myConnectionDocRef, myConnectionParams, { merge: true });
      batch.set(secondConnectionDocRef, secondConnectionParams, { merge: true });
      batch.set(matchDocRef, matchParams, { merge: true });
      try {
        console.log('before commit');
        await batch.commit();
        console.log('after commit');
      } catch (error) {
        console.error(error);
      }
    }
    console.log('last');

  }

} 
