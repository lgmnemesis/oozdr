import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { SharedStoreService } from 'src/app/services/shared-store.service';
import { SharedService } from 'src/app/services/shared.service';
import { Match, Connection } from 'src/app/interfaces/profile';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/interfaces/user';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-matches-page',
  templateUrl: './matches.page.html',
  styleUrls: ['./matches.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MatchesPage implements OnInit, OnDestroy {

  @ViewChild('content', {static: false}) private content: any;

  isVisibleSplitPane = false;
  _isVisibleSplitPane: Subscription;
  match: Match
  _match: Subscription;
  _route: Subscription;
  user: User = this.authService.getUser();
  isInsideChat = false;
  defaultProfileImg = this.sharedService.defaultProfileImg;
  connection: Connection;

  constructor(private sharedStoreService: SharedStoreService,
    private cd: ChangeDetectorRef,
    private sharedService: SharedService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit() {
    this.sharedStoreService.useSplitPaneSubject.next(true);
    this._isVisibleSplitPane = this.sharedStoreService.isVisibleSplitPane$.subscribe((isVisible) => {
      this.isVisibleSplitPane = isVisible;
      this.markForCheck();
    });

    this._match = this.sharedStoreService.matchSubject.subscribe((match) => {
      this.match = match;
      this.scrollToBottom();
      this.markForCheck();
    })

    this._route = this.route.params.subscribe(params => {
      const cid: string = params['cid'];
      this.isInsideChat = false;
      this.sharedStoreService.activeMatchConnectionId = null;
      this.sharedStoreService.activeMenuSubject.next('matches');
      if (cid) {
        this.isInsideChat = true;
        this.connection = this.sharedStoreService.getConnectionById(cid);
        if (this.connection) {
          this.sharedStoreService.subscribeToMatchById(this.connection.match_id);
          this.sharedStoreService.activeMatchConnectionId = cid;
        }
        this.markForCheck();
      }
    });
  }

  markForCheck() {
    this.cd.markForCheck();
  }

  scrollToBottom(time = 300) {
    try {
      if (this.content) {
        this.content.scrollToBottom(time);
      }
    } catch (error) {
      console.error(error);
    }
  }

  goBack() {
    this.router.navigate(['/matches']).catch(error => console.error(error));
  }

  ngOnDestroy() {
    if (this._isVisibleSplitPane) {
      this._isVisibleSplitPane.unsubscribe();
    }
  }
}
