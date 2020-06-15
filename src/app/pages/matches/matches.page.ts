import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { SharedStoreService } from 'src/app/services/shared-store.service';
import { SharedService } from 'src/app/services/shared.service';
import { Match, Connection } from 'src/app/interfaces/profile';
import { AuthService } from 'src/app/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { PopoverController, AlertController } from '@ionic/angular';
import { MatchOptionsComponent } from 'src/app/components/match-options/match-options.component';
import { AnalyticsService } from 'src/app/services/analytics.service';
import { MatchDetailsComponent } from 'src/app/components/match-details/match-details.component';
import { LocaleService } from 'src/app/services/locale.service';

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
  inOpenDetailsProcess = false;
  isMobile = false;
  dictionary = this.localeService.dictionary;
  dictMatches = this.dictionary.matchePage;

  constructor(private sharedStoreService: SharedStoreService,
    private cd: ChangeDetectorRef,
    private sharedService: SharedService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private popoverCtrl: PopoverController,
    private alertCtrl: AlertController,
    private analyticsService: AnalyticsService,
    private localeService: LocaleService) { }

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

    this.isMobile = this.sharedService.isMobileApp();
  }

  markForCheck() {
    this.cd.markForCheck();
  }

  updateActiveMatch() {
    if (this.connection && this.matches) {
      const matchId = this.connection.match_id;
      const found = this.matches.find(m => m.id === matchId);
      if (found) {
        this.activeMatch = JSON.parse(JSON.stringify(found));
      }
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

  async openDetails(ev) {
    if (this.inOpenDetailsProcess) {
      return;
    }
    this.inOpenDetailsProcess = true;

    const popover = await this.popoverCtrl.create({
      component: MatchDetailsComponent,
      event: ev,
      componentProps: {connection: this.connection},
      mode: 'ios',
      cssClass: 'match-details-popover'
    });

    popover.onWillDismiss().then((res) => {
      this.inOpenDetailsProcess = false;
    }).catch(error => {
      console.error(error);
      this.inOpenDetailsProcess = false;
    });

    return await popover.present().catch(error => {
      console.error(error);
      this.inOpenDetailsProcess = false;
    });
  }

  async openOptions(ev) {
    if (this.inOpenOptionsProcess) {
      return;
    }
    this.inOpenOptionsProcess = true;

    const popover = await this.popoverCtrl.create({
      component: MatchOptionsComponent,
      event: ev,
      componentProps: {connection: this.connection},
      mode: 'ios',
      cssClass: 'match-options-popover'
    });

    popover.onWillDismiss().then((res) => {
      if (res && res.data && res.data.block) {
        const name = this.connection.basicInfo.name;
        const nameC = name[0].toUpperCase() + name.slice(1);
        const header = `${this.dictMatches.blockHeader} ${nameC}`;
        const message = this.dictMatches.blockMessage;
        const buttonText = this.dictMatches.blockButtonText;
        this.presentConfirm(header, message, buttonText, true, 'block');
      }
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

  private async presentConfirm(header: string, message: string, buttonText: string, isDangerColor: boolean, action: string) {
    const alert = await this.alertCtrl.create({
      header: header,
      message: message,
      mode: 'ios',
      cssClass: 'alert-confirm-conainer',
      buttons: [
        {
          text: this.dictMatches.confirmCancel,
          role: 'cancel',
          handler: () => {
          }
        }, {
          text: buttonText,
          cssClass: isDangerColor ? 'alert-danger-text-color' : '',
          handler: () => {
            this.confirmAction(action);
          }
        }
      ]
    });

    await alert.present();
  }

  confirmAction(action: string) {
    if (action === 'block') {
      this.sharedStoreService.updateConnectionData(this.connection, {isBlocked: true});
      this.analyticsService.matchBlockedEvent();
      this.sharedStoreService.activeMenuSubject.next(this.sharedService.menu2);
      if (this.isVisibleSplitPane) {
        this.goto('/connections');
      } else {
        this.goBack();
      }
    }
  }

  goBack() {
    this.goto('matches');
  }
  
  goto(url: string) {
    this.router.navigate([url]).catch(error => console.error(error));
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
