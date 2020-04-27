import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ConnectionsState } from '../interfaces/connections-state';

@Injectable({
  providedIn: 'root'
})
export class SharedStatesService {

  canEnterWelcome = false;
  canEnterHome = false;
  activeTopMenu = '2';
  activeMenu = 'connections';
  shouldAnimateStartPage = true;

  useSplitPaneSubject: BehaviorSubject<boolean> = new BehaviorSubject(false);
  useSplitPane$ = this.useSplitPaneSubject.asObservable();
  isVisibleSplitPaneSubject: BehaviorSubject<boolean> = new BehaviorSubject(false);
  isVisibleSplitPane$ = this.isVisibleSplitPaneSubject.asObservable();

  connectionsStateSubject: BehaviorSubject<ConnectionsState> = new BehaviorSubject({state: 'view'});
  connectionsState$ = this.connectionsStateSubject.asObservable();

  constructor() { }
}
