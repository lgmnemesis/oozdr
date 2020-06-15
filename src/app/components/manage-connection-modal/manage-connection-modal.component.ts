import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ConnectionsState } from 'src/app/interfaces/connections-state';
import { ModalController, AlertController } from '@ionic/angular';
import { ContactPickerApiService } from 'src/app/services/contact-picker-api.service';
import { LocaleService } from 'src/app/services/locale.service';

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
  dictionary = this.localeService.dictionary;
  dictManage = this.dictionary.manageConnectionModalComponent;

  constructor(private modalCtrl: ModalController,
    public contactPickerApiService: ContactPickerApiService,
    private cd: ChangeDetectorRef,
    private alertCtrl: AlertController,
    private localeService: LocaleService) { }

  ngOnInit() {
    const state = this.connectionsState && this.connectionsState.state ? this.connectionsState.state : null;
    const connection = this.connectionsState ? this.connectionsState.connection : null;
    if (state) {
      if (state === 'add') this.title = this.dictManage.title_1;
      if (state === 'edit') this.title = this.dictManage.title_2;
      if (state === 'add_closure') this.title = this.dictManage.title_3;
      if (state === 'edit_closure') this.title = this.dictManage.title_4;

      if (state === 'edit_closure' && connection && connection.isClosureMatched)  {
        this.title = this.dictManage.title_5;
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
      header: this.dictManage.helpHeader,
      message: this.dictManage.helpMessage,
      mode: 'ios',
      cssClass: 'manage-connection-help',
      buttons: [
        {
          text: this.dictManage.textBtn,
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
