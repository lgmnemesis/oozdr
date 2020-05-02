import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef, Input } from '@angular/core';
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

  activeMatch: Connection = null;
  connections: Connection[];
  _connections: Subscription;

  constructor(private sharedStoreService: SharedStoreService,
    private cd: ChangeDetectorRef,
    private router: Router) {}

  ngOnInit() {
    this._connections = this.sharedStoreService.connections$.subscribe((connections) => {
      this.connections = connections;
      this.markForCheck();
    });
  }

  markForCheck() {
    this.cd.markForCheck();
  }

  matchButtonClicked(connection: Connection) {
    this.activeMatch = connection;
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
  }
}
