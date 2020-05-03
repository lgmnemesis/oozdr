import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef, AfterViewInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { SharedStoreService } from 'src/app/services/shared-store.service';
import { SharedService } from 'src/app/services/shared.service';
import { Match } from 'src/app/interfaces/profile';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/interfaces/user';
import { ActivatedRoute } from '@angular/router';

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
  _route: Subscription;
  user: User = this.authService.getUser();

  constructor(private sharedStoreService: SharedStoreService,
    private cd: ChangeDetectorRef,
    private sharedService: SharedService,
    private authService: AuthService,
    private route: ActivatedRoute) { }

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

    this._route = this.route.params.subscribe(params => {
      const mid = params['mid'];
      const cid = params['cid'];
      if (mid && cid) {
        this.sharedStoreService.activeMatchConnectionId = cid;
        this.sharedStoreService.subscribeToMatchById(mid);
        this.sharedStoreService.activeMenuSubject.next('matches');
        this.markForCheck();
      }
    });
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
