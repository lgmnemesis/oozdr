import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Profile, Connection, Match, Message, LastMessage } from '../interfaces/profile';
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

  async updateProfileData(profile: Profile, data: any) {
    const path = 'profiles/';
    try {
      return this.afs.collection(path).doc(profile.user_id).update(data);
    }
    catch (error) {
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

  private getMatchesDbRef(userId: string, batchSize = 100): AngularFirestoreCollection<Match[]> {
    const path = 'matches/';
    return this.afs.collection(path, ref => {
      return ref.where('participates', 'array-contains', userId)
      .limit(batchSize);
    });
  }

  getMatchesAsObservable(userId: string): Observable<Match[]> {
    return this.getMatchesDbRef(userId).valueChanges()
    .pipe(catchError((error) => {
      if (!environment.production) {
        console.error(error);
      }
      return of(null);
    }));
  }

  
  async setMatchPartyHasReadMessages(lastMessage: LastMessage) {
    const path = 'matches/' + lastMessage.match.id;
    const data = {
      firstParty: lastMessage.match.firstParty,
      secondParty: lastMessage.match.secondParty,
    }
    const isFirstParty = lastMessage.isFirstParty;
    if (isFirstParty) {
      data.firstParty.hasNewMessages = false;
    } else {
      data.secondParty.hasNewMessages = false;
    }
    console.log('moshe DB setMatchPartyHasReadMessages');
    try {
      return this.afs.doc(path).update(data);
    } catch (error) {
      return console.error(error);
    }
  }

  async addMatchMessage(match: Match, message: Message) {
    const path = 'matches/' + message.match_id;
    const data = {
      firstParty: match.firstParty,
      secondParty: match.secondParty,
      messages: firebase.firestore.FieldValue.arrayUnion(message)
    }
    const isFirstParty = message.user_id === match.firstParty.user_id;
    if (isFirstParty) {
      data.firstParty.hasNewMessages = false;
      data.secondParty.hasNewMessages = true;
    } else {
      data.firstParty.hasNewMessages = true;
      data.secondParty.hasNewMessages = false;
    }
    console.log('moshe DB addMatchMessage');
    try {
      return this.afs.doc(path).update(data);
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
        if (docData.user_id !== connection.user_id) {
          secondPartyConnection = docData;
        }
      });
    } catch (error) {
      console.error("Error getting documents: ", error);
    }

    if (secondPartyConnection) {
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
      const batch = db.batch();
      batch.set(myConnectionDocRef, myConnectionParams, { merge: true });
      batch.set(secondConnectionDocRef, secondConnectionParams, { merge: true });
      batch.set(matchDocRef, matchParams, { merge: true });
      try {
        await batch.commit();
      } catch (error) {
        console.error(error);
      }
    }
  }

  deleteUserData() {
    // Deleting profile and connections
  }

} 
