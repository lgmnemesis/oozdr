import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
})
export class SignInComponent implements OnInit {

  @Input() reauthenticate = false;
  @Output() processDoneEvent = new EventEmitter();

  constructor(private modalCtrl: ModalController,
    private router: Router) { }

  ngOnInit() {
  }

  processDone(event) {
    if (event && event.userCredential) {
      this.processDoneEvent.next(event);
    }
  }

  signUp() {
    this.close();
    this.router.navigate(['/welcome']).catch(error => console.error(error));
  }
  close() {
    try {
      this.modalCtrl.dismiss();
    } catch (error) {
      console.error(error);
    }
  }
}
