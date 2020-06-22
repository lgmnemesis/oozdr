import { Injectable } from '@angular/core';
import { ProvDatabaseService } from './prov-database.service';
import { Subscription, BehaviorSubject } from 'rxjs';
import { Profile } from 'src/app/interfaces/profile';
import { UserData } from '../interfaces/general';
import { debounceTime } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProvStoreService {


  usersData: Map<string, UserData> = new Map();

  _profilesDB: Subscription;
  _profiles: Subscription;
  profilesSubject: BehaviorSubject<Profile[]> = new BehaviorSubject(null);
  profiles$ = this.profilesSubject.asObservable();
  
  usersDataSubject: BehaviorSubject<UserData[]> = new BehaviorSubject(null);
  usersData$ = this.usersDataSubject.asObservable();
  
  private _usersDataUpdate: Subscription;
  private usersDataUpdatedSubject: BehaviorSubject<boolean> = new BehaviorSubject(false);
  private usersDataUpdate$ = this.usersDataUpdatedSubject.asObservable();

  constructor(private provDatabaseService: ProvDatabaseService) { }

  registerAllUsersRelatedData(batch = 100) {
    if (!this._usersDataUpdate || this._usersDataUpdate.closed) {
      this.usersDataUpdate$.pipe(debounceTime(1000)).subscribe((updated) => {
        if (updated) {
          const data: UserData[] = [];
          for (const v of this.usersData.values()) {
            data.push(v);
          }
          console.log('moshe: got update');
          this.usersDataSubject.next(data);
        }
      });
    }

    if (!this._profilesDB || this._profilesDB.closed) {
      this._profilesDB = this.provDatabaseService.getProfilesAsObservable(batch).subscribe((profiles) => {
        this.profilesSubject.next(profiles);
      });
    }

    if (!this._profiles || this._profiles.closed) {
      this._profiles = this.profiles$.subscribe((profiles) => {
        if (profiles) {
          profiles.forEach(profile => {
            const data = this.usersData.get(profile.user_id);
            if (!data) {
              this.usersData.set(profile.user_id, 
                {id: profile.user_id, profile: profile, connectionsData: {_connections: null, connections: null}}
              );
              const newData = this.usersData.get(profile.user_id);
              const _connetions = this.provDatabaseService.getConnectionsAsObservable(profile.user_id).subscribe((connections) => {
                if (connections) {
                  newData.connectionsData.connections = connections;
                  this.usersDataUpdatedSubject.next(true);
                }
              });
              newData.connectionsData._connections = _connetions;
            } else {
              data.profile = profile;
            }
          });
          this.usersDataUpdatedSubject.next(true);
        }
      });
    }
  }
}
