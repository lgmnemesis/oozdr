import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { SharedStoreService } from 'src/app/services/shared-store.service';

@Component({
  selector: 'app-matches-page',
  templateUrl: './matches.page.html',
  styleUrls: ['./matches.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MatchesPage implements OnInit, OnDestroy {

  isVisibleSplitPane = false;
  _isVisibleSplitPane: Subscription;

  constructor(private sharedStoreService: SharedStoreService,
    private cd: ChangeDetectorRef) { }

  ngOnInit() {
    this.sharedStoreService.useSplitPaneSubject.next(true);
    this._isVisibleSplitPane = this.sharedStoreService.isVisibleSplitPane$.subscribe((isVisible) => {
      this.isVisibleSplitPane = isVisible;
      this.markForCheck();
    });

  }

  markForCheck() {
    this.cd.markForCheck();
  }

  ngOnDestroy() {
    if (this._isVisibleSplitPane) {
      this._isVisibleSplitPane.unsubscribe();
    }
  }
}
