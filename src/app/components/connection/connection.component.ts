import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { Connection } from 'src/app/interfaces/profile';
import { SharedStoreService } from 'src/app/services/shared-store.service';
import { AlertController } from '@ionic/angular';
import { ConnectionsService } from 'src/app/services/connections.service';
import { ToastMessage } from 'src/app/interfaces/toast-message';

@Component({
  selector: 'app-connection',
  templateUrl: './connection.component.html',
  styleUrls: ['./connection.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConnectionComponent implements OnInit {

  @Input() 
  set connectionInput(c: Connection) {
    this.connection = c;
    if (this.connection && this.connection.isMatched) {
      this.dismissToast();
    }
  };

  connection: Connection = null;
  inDisconnectProcess = false;

  constructor(private sharedStoreService: SharedStoreService,
    private alertCtrl: AlertController,
    private connectionsService: ConnectionsService) { }

  ngOnInit() {}

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
      header: `Are you sure you want to disconnect from ${this.connection.basicInfo.name}?`,
      mode: 'ios',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            this.inDisconnectProcess = false;
          }
        }, {
          text: 'Disconnect',
          handler: () => {
            this.disconnect();
            this.inDisconnectProcess = false;
          }
        }
      ]
    });

    await alert.present();
  }
}
