import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ConnectionsState } from '../interfaces/connections-state';

@Injectable({
  providedIn: 'root'
})
export class SharedStatesService {

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

  constructor() { }

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
  }
}
