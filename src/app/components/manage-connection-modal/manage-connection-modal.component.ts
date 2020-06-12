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
  title =  '';

  constructor(private modalCtrl: ModalController,
    public contactPickerApiService: ContactPickerApiService,
    private cd: ChangeDetectorRef) { }

  ngOnInit() {
    const state = this.connectionsState && this.connectionsState.state ? this.connectionsState.state : null;
    if (state) {
      if (state === 'add') this.title = 'Make Beat';
      if (state === 'edit') this.title = 'Edit Beat';
      if (state === 'add_closure') this.title = 'Add Closure';
      if (state === 'edit_closure') this.title = 'Edit Closure';
    }
  }

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
