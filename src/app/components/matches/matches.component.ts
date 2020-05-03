import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef, Input, Output, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs';
import { SharedStoreService } from 'src/app/services/shared-store.service';
import { Connection } from 'src/app/interfaces/profile';
import { Router } from '@angular/router';

@Component({
  selector: 'app-matches',
  templateUrl: './matches.component.html',
  styleUrls: ['./matches.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MatchesComponent implements OnInit, OnDestroy {

  @Input() inViewMode = false;
  @Output() matchClicked = new EventEmitter();

  activeMenu: string;
  _activeMenu: Subscription;
  connections: Connection[];
  _connections: Subscription;

  constructor(public sharedStoreService: SharedStoreService,
    private cd: ChangeDetectorRef,
    private router: Router) {}

  ngOnInit() {
    this._connections = this.sharedStoreService.connections$.subscribe((connections) => {
      this.connections = connections;
      this.markForCheck();
    });

    this._activeMenu = this.sharedStoreService.activeMenu$.subscribe((active) => {
      this.activeMenu = active;
      this.markForCheck();
    });
  }

  markForCheck() {
    this.cd.markForCheck();
  }

  matchButtonClicked(connection: Connection) {
    console.log('match clicked');
    this.sharedStoreService.activeMatch = connection;
    this.sharedStoreService.activeMenuSubject.next('matches');
    this.matchClicked.next(true);
    this.markForCheck();
    this.router.navigate(['/matches']).catch(error => console.error(error));
    // send selected match?/connetcion? so that matches component under matches page will display it
  }

  trackById(i, connection) {
    return connection.id;
  }

  ngOnDestroy() {
    if (this._connections) {
      this._connections.unsubscribe();
    }
    if (this._activeMenu) {
      this._activeMenu.unsubscribe();
    }
  }
}
