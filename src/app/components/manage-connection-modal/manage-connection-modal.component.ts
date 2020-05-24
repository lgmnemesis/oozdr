import { Component, OnInit } from '@angular/core';
import { ConnectionsState } from 'src/app/interfaces/connections-state';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-manage-connection-modal',
  templateUrl: './manage-connection-modal.component.html',
  styleUrls: ['./manage-connection-modal.component.scss'],
})
export class ManageConnectionModalComponent implements OnInit {

  connectionsState: ConnectionsState;

  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {}

  close() {
    this.modalCtrl.dismiss().catch(error => console.error(error));
  }

}
