import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ConnectionsState } from 'src/app/interfaces/connections-state';
import { ModalController } from '@ionic/angular';
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

  constructor(private modalCtrl: ModalController,
    public contactPickerApiService: ContactPickerApiService,
    private cd: ChangeDetectorRef) { }

  ngOnInit() {}

  markForCheck() {
    this.cd.markForCheck();
  }

  gotContacts(event) {
    this.contacts = event;
    this.markForCheck();
  }

  close() {
    this.modalCtrl.dismiss().catch(error => console.error(error));
  }

}
