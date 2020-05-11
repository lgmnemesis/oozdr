import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { SharedStoreService } from 'src/app/services/shared-store.service';
import { SharedService } from 'src/app/services/shared.service';
import { Match, Connection } from 'src/app/interfaces/profile';
import { AuthService } from 'src/app/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { PopoverController } from '@ionic/angular';
import { MatchOptionsComponent } from 'src/app/components/match-options/match-options.component';

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
  _matches: Subscription;
  _route: Subscription;
  user: firebase.User;
  isInsideChat = false;
  defaultProfileImg = this.sharedService.defaultProfileImg;
  connection: Connection;
  matches: Match[];
  activeMatch: Match;
  inOpenOptionsProcess = false;

  constructor(private sharedStoreService: SharedStoreService,
    private cd: ChangeDetectorRef,
    private sharedService: SharedService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private popoverCtrl: PopoverController) { }

  async ngOnInit() {
    this.user = await this.authService.getUser();
    this.sharedStoreService.useSplitPaneSubject.next(true);
    this._isVisibleSplitPane = this.sharedStoreService.isVisibleSplitPane$.subscribe((isVisible) => {
      this.isVisibleSplitPane = isVisible;
      this.cd.detectChanges();
    });

    this._matches = this.sharedStoreService.matches$.subscribe((matches) => {
      this.matches = matches;
      this.updateActiveMatch();
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
          this.sharedStoreService.activeMatchConnectionId = cid;
          this.updateActiveMatch();
        }
      }
      this.markForCheck();
    });
  }

  markForCheck() {
    this.cd.markForCheck();
  }

  updateActiveMatch() {
    if (this.connection && this.matches) {
      const matchId = this.connection.match_id;
      this.activeMatch = this.matches.find(m => m.id === matchId);
      this.scrollToBottom();
    }
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

  async openOptions(ev) {
    if (this.inOpenOptionsProcess) {
      return;
    }
    this.inOpenOptionsProcess = true;

    const popover = await this.popoverCtrl.create({
      component: MatchOptionsComponent,
      event: ev,
      mode: 'ios',
      cssClass: 'match-options-popover'
    });

    popover.onWillDismiss().then((data) => {
      this.inOpenOptionsProcess = false;
    }).catch(error => {
      console.error(error);
      this.inOpenOptionsProcess = false;
    });

    return await popover.present().catch(error => {
      console.error(error);
      this.inOpenOptionsProcess = false;
    });
  }

  goBack() {
    this.router.navigate(['/matches']).catch(error => console.error(error));
  }

  ngOnDestroy() {
    if (this._isVisibleSplitPane) {
      this._isVisibleSplitPane.unsubscribe();
    }
    if (this._matches) {
      this._matches.unsubscribe();
    }
    if (this._route) {
      this._route.unsubscribe();
    }
  }
}
