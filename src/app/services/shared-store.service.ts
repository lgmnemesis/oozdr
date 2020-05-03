import { Injectable } from '@angular/core';
import { BehaviorSubject, Subscription, Observable } from 'rxjs';
import { ConnectionsState } from '../interfaces/connections-state';
import { DatabaseService } from './database.service';
import { Profile, Connection } from '../interfaces/profile';
import { first } from 'rxjs/operators';

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
  activeMatch: Connection = null;

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

  constructor(private databaseService: DatabaseService) { }

  resetStore() {
    this.canEnterWelcome = false;
    this.canEnterHome = false;
    this.activeTopMenu = 'connections';
    this.activeMenuSubject.next('connections');
    this.shouldAnimateStartPage = false;
    this.isMatchesOpen = true;
    this.needToFinishInfoRegistration = false;

    this.useSplitPaneSubject.next(false);
    this.isVisibleSplitPaneSubject.next(false);
    this.connectionsStateSubject.next({state: 'view'});
    this.profileSubject.next(null);

    this.unsubscribe();
  }

  unsubscribe() {
    if (this._profileDB) {
      this._profileDB.unsubscribe();
    }
    if (this._connectionsDB) {
      this._connectionsDB.unsubscribe();
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
        this.connectionsSubject.next(connections);
      });
    }
  }

  updateProfile(profile: Profile): Promise<void> {
    return this.databaseService.updateProfile(profile);
  }

  addConnection(connection: Connection): Promise<void> {
    return this.databaseService.addConnection(connection);
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
     }
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
