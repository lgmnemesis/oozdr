import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ConnectionsState } from 'src/app/interfaces/connections-state';
import { ModalController, AlertController } from '@ionic/angular';
import { ContactPickerApiService } from 'src/app/services/contact-picker-api.service';

@Component({
  selector: 'app-manage-connection-modal',
  templateUrl: './manage-connection-modal.component.html',
  styleUrls: ['./manage-connection-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ManageConnectionModalComponent implements OnInit {

  connectionsState: ConnectionsState;
  contacts = null;
  title =  '';
  showHelpLock = false;
  canEdit = true;
  canShowHelp = false;

  constructor(private modalCtrl: ModalController,
    public contactPickerApiService: ContactPickerApiService,
    private cd: ChangeDetectorRef,
    private alertCtrl: AlertController) { }

  ngOnInit() {
    const state = this.connectionsState && this.connectionsState.state ? this.connectionsState.state : null;
    const connection = this.connectionsState ? this.connectionsState.connection : null;
    if (state) {
      if (state === 'add') this.title = 'Make Beat';
      if (state === 'edit') this.title = 'Edit Beat';
      if (state === 'add_closure') this.title = 'Add Closure';
      if (state === 'edit_closure') this.title = 'Edit Closure';

      if (state === 'edit_closure' && connection && connection.isClosureMatched)  {
        this.title = 'Closure';
        this.canEdit = false;
      }

      this.canShowHelp = this.canEdit && (state === 'add_closure' || state === 'edit_closure');
    }
  }

  markForCheck() {
    this.cd.markForCheck();
  }

  gotContacts(event) {
    this.contacts = event;
    this.markForCheck();
  }

  async showHelp() {
    if (this.showHelpLock || !this.canShowHelp) return;
    this.showHelpLock = true;

    const alert = await this.alertCtrl.create({
      header: `Adding Closure`,
      message:
`
Writing a closure message can benefit you as well as your EX...
It's meant to allow you to accept what has happened, say goodbye, and move on.

<span>Just like Beats, your closure will be matched and shown only if the other person is looking for you too (whether it is to reconnect or to give you their own closure message).</span>

`,
      mode: 'ios',
      cssClass: 'manage-connection-help',
      buttons: [
        {
          text: 'Got It',
          handler: () => {
            this.showHelpLock = false;
          }
        }
      ]
    });

    alert.onDidDismiss().finally(() => {
      this.showHelpLock = false;
    });
    await alert.present();
  }

  close() {
    this.modalCtrl.dismiss().catch(error => console.error(error));
  }

}
