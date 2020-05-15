import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-invite-friends-modal',
  templateUrl: './invite-friends-modal.component.html',
  styleUrls: ['./invite-friends-modal.component.scss'],
})
export class InviteFriendsModalComponent implements OnInit {

  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {}

  close(data?: any) {
    this.modalCtrl.dismiss(data).catch((error) => console.error(error));
  }
}
