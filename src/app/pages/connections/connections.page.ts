import { Component, OnInit, ChangeDetectorRef, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { Subscription } from 'rxjs';
import { SharedService } from 'src/app/services/shared.service';
import { SharedStatesService } from 'src/app/services/shared-states.service';

@Component({
  selector: 'app-connections-page',
  templateUrl: './connections.page.html',
  styleUrls: ['./connections.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConnectionsPage implements OnInit, OnDestroy {

  isVisibleSplitPane = false;
  _isVisibleSplitPane: Subscription;

  constructor(private sharedService: SharedService,
    private sharedStatesService: SharedStatesService,
    private cd: ChangeDetectorRef) { }

  ngOnInit() {
    this.sharedStatesService.useSplitPaneSubject.next(true);
    this._isVisibleSplitPane = this.sharedStatesService.isVisibleSplitPane$.subscribe((isVisible) => {
      this.isVisibleSplitPane = isVisible;
      this.markForCheck();
    });
    // this.sharedService.setDefaultPhoneCountryCode();
  }

  markForCheck() {
    this.cd.markForCheck();
  }

  ngOnDestroy() {
    this.sharedStatesService.useSplitPaneSubject.next(false);
    if (this._isVisibleSplitPane) {
      this._isVisibleSplitPane.unsubscribe();
    }
  }
}
