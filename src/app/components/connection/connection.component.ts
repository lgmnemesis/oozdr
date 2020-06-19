import { Component, OnInit, Input, ChangeDetectionStrategy, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Connection } from 'src/app/interfaces/profile';
import { SharedStoreService } from 'src/app/services/shared-store.service';
import { AlertController } from '@ionic/angular';
import { ConnectionsService } from 'src/app/services/connections.service';
import { ToastMessage } from 'src/app/interfaces/toast-message';
import { AnalyticsService } from 'src/app/services/analytics.service';
import { LocaleService } from 'src/app/services/locale.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-connection',
  templateUrl: './connection.component.html',
  styleUrls: ['./connection.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConnectionComponent implements OnInit, OnDestroy {

  @Input() 
  set connectionInput(c: Connection) {
    this.connection = c;
    if (this.connection && this.connection.isMatched) {
      this.dismissToast();
    }
  };

  _markForCheckApp: Subscription;
  connection: Connection = null;
  inDisconnectProcess = false;
  dictionary = this.localeService.dictionary;
  dictConnection = this.dictionary.connectionComponent;

  constructor(private sharedStoreService: SharedStoreService,
    private alertCtrl: AlertController,
    private connectionsService: ConnectionsService,
    private analyticsService: AnalyticsService,
    private localeService: LocaleService,
    private cd: ChangeDetectorRef) { }

  ngOnInit() {
    this._markForCheckApp = this.sharedStoreService.markForCheckApp$.subscribe((mark) => {
      if (mark) {
        this.dictionary = this.localeService.dictionary;
        this.dictConnection = this.dictionary.connectionComponent;
        this.markForCheck();
      }
    })
  }

  markForCheck() {
    this.cd.markForCheck();
  }

  cardClicked() {
    if (this.connection.isNewMatch) {
      this.dismissToast();
      this.connectionsService.gotoMatch(this.connection);
    }
  }

  async disconnect() {
    this.sharedStoreService.removeConnection(this.connection)
      .catch(error => console.error(error));
    this.dismissToast();
    if (this.connection.isClosure) {
      this.analyticsService.closureRemovedEvent();
    } else {
      this.analyticsService.beatRemovedEvent();
    }
  }

  edit(fromContent = false) {
    if (fromContent && !this.connection.isClosureMatched) return;
    const state = this.connection.isClosure ? 'edit_closure' : 'edit';
    this.sharedStoreService.connectionsStateSubject.next({connection: this.connection, state: state});
  }

  dismissToast() {
    const message: ToastMessage = {
      message: '',
      type: 'connection_added',
      id: this.connection.id,
      isVisible: false
    }
    this.sharedStoreService.toastNotificationsSubject.next(message);
  }

  async presentDisconnectConfirm() {
    if (this.inDisconnectProcess) {
      return;
    }
    this.inDisconnectProcess = true;

    const alert = await this.alertCtrl.create({
      header: `${this.dictConnection.disconnect} ${this.connection.basicInfo.name}?`,
      mode: 'ios',
      buttons: [
        {
          text: this.dictConnection.disconnectCancel,
          role: 'cancel',
          handler: () => {
            this.inDisconnectProcess = false;
          }
        }, {
          text: this.dictConnection.disconnectAprove,
          handler: () => {
            this.disconnect();
            this.inDisconnectProcess = false;
          }
        }
      ]
    });

    await alert.present();
  }

  ngOnDestroy() {
    if (this._markForCheckApp) this._markForCheckApp.unsubscribe();
  }
}
