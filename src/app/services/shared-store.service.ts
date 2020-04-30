import { Injectable } from '@angular/core';
import { BehaviorSubject, Subscription, Observable } from 'rxjs';
import { ConnectionsState } from '../interfaces/connections-state';
import { DatabaseService } from './database.service';
import { Profile, Connection } from '../interfaces/profile';
import { User } from 'firebase';
import { first } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SharedStoreService {

  canEnterWelcome = false;
  canEnterHome = false;
  activeTopMenu = 'connections';
  activeMenu = 'connections';
  shouldAnimateStartPage = true;
  isMatchesOpen = true;

  useSplitPaneSubject: BehaviorSubject<boolean> = new BehaviorSubject(false);
  useSplitPane$ = this.useSplitPaneSubject.asObservable();
  
  isVisibleSplitPaneSubject: BehaviorSubject<boolean> = new BehaviorSubject(false);
  isVisibleSplitPane$ = this.isVisibleSplitPaneSubject.asObservable();

  connectionsStateSubject: BehaviorSubject<ConnectionsState> = new BehaviorSubject({state: 'view'});
  connectionsState$ = this.connectionsStateSubject.asObservable();

  _profileDB: Subscription;
  profileSubject: BehaviorSubject<Profile> = new BehaviorSubject(null);
  profile$: Observable<Profile> = this.profileSubject.asObservable();

  constructor(private databaseService: DatabaseService) { }

  resetStore() {
    this.canEnterWelcome = false;
    this.canEnterHome = false;
    this.activeTopMenu = 'connections';
    this.activeMenu = 'connections';
    this.shouldAnimateStartPage = false;
    this.isMatchesOpen = true;

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
  }

  async registerToProfile(userId: string) {
    console.log('moshe register 1:', userId);
    console.log('moshe register 2');
    if (userId && (!this._profileDB || this._profileDB.closed)) {
      console.log('moshe register 3 in');
      this._profileDB = this.databaseService.getProfileAsObservable(userId).subscribe((profile) => {
        this.profileSubject.next(profile);
      });
    }
    console.log('moshe register 4');
  }

  updateProfile(profile: Profile): Promise<void> {
    return this.databaseService.updateProfile(profile);
  }

  addConnection(profile: Profile, connection: Connection): Promise<void> {
    return this.databaseService.addConnection(profile, connection);
  }

  removeConnection(profile: Profile, connection: Connection): Promise<void> {
    return this.databaseService.removeConnection(profile, connection);
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
}
