import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { Connection } from 'src/app/interfaces/profile';
import { SharedStoreService } from 'src/app/services/shared-store.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-connection',
  templateUrl: './connection.component.html',
  styleUrls: ['./connection.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConnectionComponent implements OnInit {

  @Input() connection: Connection = null;

  inDisconnectProcess = false;

  constructor(private sharedStoreService: SharedStoreService,
    private alertCtrl: AlertController) { }

  ngOnInit() {}

  async disconnect() {
    const profile = await this.sharedStoreService.getProfile();
    this.sharedStoreService.removeConnection(profile, this.connection)
      .catch(error => console.error(error));
  }

  async presentDisconnectConfirm() {
    if (this.inDisconnectProcess) {
      return;
    }
    this.inDisconnectProcess = true;

    const alert = await this.alertCtrl.create({
      header: `Are you sure you want to disconnect from ${this.connection.info.name}?`,
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
