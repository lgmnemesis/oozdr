import { Injectable } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { ConnectionsState } from '../interfaces/connections-state';
import { DatabaseService } from './database.service';
import { Profile, Connection, Match, Message, LastMessage } from '../interfaces/profile';
import { first } from 'rxjs/operators';
import { ToastMessage } from '../interfaces/toast-message';
import { Alert } from '../interfaces/general';

@Injectable({
  providedIn: 'root'
})
export class SharedStoreService {

  canEnterWelcome = false;
  canEnterHome = false;
  activeTopMenu = 'connections';
  shouldAnimateStartPage = true;
  isMatchesOpen = true;
  needToFinishInfoRegistration = false;
  activeMatchConnectionId: string = null;
  connections: Connection[] = [];
  lastActiveMessage: LastMessage = null;
  userDeleted = false;

  activeMenuSubject: BehaviorSubject<string> = new BehaviorSubject('connections');
  activeMenu$ = this.activeMenuSubject.asObservable();

  useSplitPaneSubject: BehaviorSubject<boolean> = new BehaviorSubject(false);
  useSplitPane$ = this.useSplitPaneSubject.asObservable();
  
  isVisibleSplitPaneSubject: BehaviorSubject<boolean> = new BehaviorSubject(false);
  isVisibleSplitPane$ = this.isVisibleSplitPaneSubject.asObservable();

  connectionsStateSubject: BehaviorSubject<ConnectionsState> = new BehaviorSubject({state: 'view'});
  connectionsState$ = this.connectionsStateSubject.asObservable();

  _profileDB: Subscription;
  profileSubject: BehaviorSubject<Profile> = new BehaviorSubject(null);
  profile$ = this.profileSubject.asObservable();

  _connectionsDB: Subscription;
  connectionsSubject: BehaviorSubject<Connection[]> = new BehaviorSubject(null);
  connections$ = this.connectionsSubject.asObservable();

  _matchesDB: Subscription;
  matchesSubject: BehaviorSubject<Match[]> = new BehaviorSubject(null);
  matches$ = this.matchesSubject.asObservable();

  _newMatchesIndicator: Subscription;
  newMatchesIndicatorSubject: BehaviorSubject<boolean> = new BehaviorSubject(false);
  newMatchesIndicator$ = this.newMatchesIndicatorSubject.asObservable();

  _toastNotifications: Subscription;
  toastNotificationsSubject: BehaviorSubject<ToastMessage> = new BehaviorSubject(null);
  toastNotifications$ = this.toastNotificationsSubject.asObservable();

  _alerts: Subscription;
  alertsSubject: BehaviorSubject<Alert[]> = new BehaviorSubject(null);
  alerts$ = this.alertsSubject.asObservable();

  constructor(private databaseService: DatabaseService) { }

  resetStore() {
    this.canEnterWelcome = false;
    this.canEnterHome = false;
    this.activeTopMenu = 'connections';
    this.shouldAnimateStartPage = false;
    this.isMatchesOpen = true;
    this.needToFinishInfoRegistration = false;
    this.activeMatchConnectionId = null;
    this.connections = [];
    this.lastActiveMessage = null;
    
    this.activeMenuSubject.next('connections');
    this.useSplitPaneSubject.next(false);
    this.isVisibleSplitPaneSubject.next(false);
    this.connectionsStateSubject.next({state: 'view'});
    this.profileSubject.next(null);
    this.connectionsSubject.next(null);
    this.matchesSubject.next(null);
    this.newMatchesIndicatorSubject.next(false);
    this.toastNotificationsSubject.next(null);
    this.alertsSubject.next(null);
  }

  unsubscribe() {
    if (this._profileDB) {
      this._profileDB.unsubscribe();
    }
    if (this._connectionsDB) {
      this._connectionsDB.unsubscribe();
    }
    if (this._matchesDB) {
      this._matchesDB.unsubscribe();
    }
  }

  async registerToProfile(userId: string) {
    if (userId && (!this._profileDB || this._profileDB.closed)) {
      this._profileDB = this.databaseService.getProfileAsObservable(userId).subscribe((profile) => {
        this.profileSubject.next(profile);
      });
    }
  }

  async registerToConnections(userId: string) {
    if (userId && (!this._connectionsDB || this._connectionsDB.closed)) {
      this._connectionsDB = this.databaseService.getConnectionsAsObservable(userId).subscribe((connections) => {
        this.connections = connections;
        this.connectionsSubject.next(connections);
      });
    }
  }

  getConnectionById(id: string): Connection {
    if (!this.connections) {
      return null;
    }
    return this.connections.find((c => c.id === id));
  }

  updateProfile(profile: Profile): Promise<void> {
    return this.databaseService.updateProfile(profile);
  }

  updateProfileData(profile: Profile, data: any): Promise<void> {
    return this.databaseService.updateProfileData(profile, data);
  }

  addConnection(connection: Connection): Promise<void> {
    return this.databaseService.addConnection(connection);
  }

  updateConnectionData(connection: Connection, data: any): Promise<void> {
    console.log('moshe updating connection data DB');
    return this.databaseService.updateConnectionData(connection, data);
  }

  removeConnection(connection: Connection): Promise<void> {
    return this.databaseService.removeConnection(connection);
  }

  async getProfile(): Promise<Profile> {
    try {
      return this.profile$.pipe(first()).toPromise();
    }
    catch (error) {
      console.error(error);
      return null;
     }
  }

  async registerToMatches(userId: string) {
    if (userId && (!this._matchesDB || this._matchesDB.closed)) {
      this._matchesDB = this.databaseService.getMatchesAsObservable(userId).subscribe((matches) => {
        this.matchesSubject.next(matches);
      });
    }
  }

  async addMatchMessage(match: Match, message: string) {
    if (match) {
      const msg: Message = {
        id: this.databaseService.createId(),
        match_id: match.id,
        content: message,
        createdAt: new Date().getTime(),
        user_id: (await this.getProfile()).user_id
      }
      this.databaseService.addMatchMessage(match, msg);
    }
  }

  setMatchPartyHasReadMessages(lastMessage: LastMessage) {
    this.databaseService.setMatchPartyHasReadMessages(lastMessage);
  }

  get timestamp(): number {
    return this.databaseService.timestamp;
  }

  createId(): string {
    return this.databaseService.createId();
  }

  moshe_tmp(connection: Connection) {
    this.databaseService.moshe_tmp(connection);
  }
}
