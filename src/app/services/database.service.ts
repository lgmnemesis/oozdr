import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Profile, Connection, Match, Message, LastMessage } from '../interfaces/profile';
import * as firebase from 'firebase/app'; 
import 'firebase/firestore';
import { Feedback } from '../interfaces/general';

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
      await this.afs.collection(path).doc(profile.user_id).set(profile, { merge: true });
    } catch (error) {
      if (!environment.production) {
        console.error(error);
      }
    }
  }

  updateProfileData(profile: Profile, data: any) {
    return this.updateProfileDataByUserId(profile.user_id, data);
  }

  async updateProfileDataByUserId(id: string, data: any) {
    const path = 'profiles/';
    try {
      await this.afs.collection(path).doc(id).update(data);
    }
    catch (error) {
      if (!environment.production) {
        console.error(error);
      }
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
      await this.afs.collection(path).doc(connection.id).set({
        ...connection,
        createdAt: timestamp
      });
    }
    catch (error) {
      if (!environment.production) {
        console.error(error);
      }
    }
  }

  async removeConnection(connection: Connection): Promise<void> {
    const path = 'connections/';
    try {
      await this.afs.collection(path).doc(connection.id).delete();
    }
    catch (error) {
      if (!environment.production) {
        console.error(error);
      }
    }
  }

  async updateConnectionData(connection: Connection, data: any) {
    const path = 'connections/';
    try {
      await this.afs.collection(path).doc(connection.id).update(data);
    }
    catch (error) {
      if (!environment.production) {
        console.error(error);
      }
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
    try {
      await this.afs.doc(path).update(data);
    } catch (error) {
      if (!environment.production) {
        console.error(error);
      }
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
    try {
      await this.afs.doc(path).update(data);
    } catch (error) {
      if (!environment.production) {
        console.error(error);
      }
    }
  }

  updateNotificationsState(user: firebase.User, tokens: string[], enabled: string): Promise<void> {
    const data = {
      fcmTokens: tokens,
      settings: {
        notifications: enabled
      }
    }
    return this.updateProfileDataByUserId(user.uid, data);
  }

  deleteUserData() {
    // Deleting profile and connections
  }

  async addFeedback(message: Feedback) {
    const path = 'feedbacks/form_feedbacks';
    const feedbacks = {
      messages: firebase.firestore.FieldValue.arrayUnion(message)
    }
    try {
      await this.afs.doc(path).update(feedbacks);
    }
    catch (error) {
      if (!environment.production) {
        console.error(error);
      }
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

} 
