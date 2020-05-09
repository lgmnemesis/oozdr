import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
})
export class SignInComponent implements OnInit {

  @Input() reauthenticate = false;
  @Output() processDoneEvent = new EventEmitter();

  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {
  }

  processDone(event) {
    if (event && event.userCredential) {
      this.processDoneEvent.next(event);
    }
  }

  close() {
    try {
      this.modalCtrl.dismiss();
    } catch (error) {
      console.error(error);
    }
  }
}
