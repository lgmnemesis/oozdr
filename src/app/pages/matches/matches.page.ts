import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef, AfterViewInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { SharedStoreService } from 'src/app/services/shared-store.service';
import { SharedService } from 'src/app/services/shared.service';
import { Match } from 'src/app/interfaces/profile';

@Component({
  selector: 'app-matches-page',
  templateUrl: './matches.page.html',
  styleUrls: ['./matches.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MatchesPage implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('content', {static: false}) private content: any;

  isVisibleSplitPane = false;
  _isVisibleSplitPane: Subscription;
  match: Match
  _match: Subscription;

  constructor(private sharedStoreService: SharedStoreService,
    private cd: ChangeDetectorRef,
    private sharedService: SharedService) { }

  ngOnInit() {
    this.sharedStoreService.useSplitPaneSubject.next(true);
    this._isVisibleSplitPane = this.sharedStoreService.isVisibleSplitPane$.subscribe((isVisible) => {
      this.isVisibleSplitPane = isVisible;
      this.markForCheck();
    });

    this._match = this.sharedStoreService.matchSubject.subscribe((match) => {
      this.match = match;
      this.markForCheck();
    })
  }

  ngAfterViewInit() {
    try {
      const content = document.querySelector('#matches-content');
      this.sharedService.styleIonScrollbars(content);
    } catch (error) {
      console.error(error);
    }
    setTimeout(() => {
      this.scrollToBottom(0);
    }, 100);
  }

  markForCheck() {
    this.cd.markForCheck();
  }

  scrollToBottom(time = 300) {
    try {
      this.content.scrollToBottom(time);
    } catch (error) {
      console.error(error);
    }
  }

  ngOnDestroy() {
    if (this._isVisibleSplitPane) {
      this._isVisibleSplitPane.unsubscribe();
    }
  }
}
