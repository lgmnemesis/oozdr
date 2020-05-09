import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-sign-in-modal',
  templateUrl: './sign-in-modal.component.html',
  styleUrls: ['./sign-in-modal.component.scss'],
})
export class SignInModalComponent implements OnInit {

  @Input() reauthenticate = false;

  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {}

  processDone(event) {
    if (event && event.userCredential) {
      this.close(event);
    }
  }

  close(data?: any) {
    this.modalCtrl.dismiss(data).catch((error) => console.error(error));
  }

}
