import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-connections',
  templateUrl: './connections.page.html',
  styleUrls: ['./connections.page.scss'],
})
export class ConnectionsPage implements OnInit, OnDestroy {

  isVisibleSplitPane = false;
  _isVisibleSplitPane: Subscription;

  constructor(private sharedService: SharedService,
    private cd: ChangeDetectorRef) { }

  ngOnInit() {
    this.sharedService.useSplitPaneSubject.next(true);
    this._isVisibleSplitPane = this.sharedService.isVisibleSplitPane$.subscribe((isVisible) => {
      this.isVisibleSplitPane = isVisible;
      this.markForCheck();
    });
    // this.sharedService.setDefaultPhoneCountryCode();
  }

  markForCheck() {
    this.cd.markForCheck();
  }

  ngOnDestroy() {
    this.sharedService.useSplitPaneSubject.next(false);
    if (this._isVisibleSplitPane) {
      this._isVisibleSplitPane.unsubscribe();
    }
  }
}
