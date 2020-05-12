import { Component, OnInit, Input } from '@angular/core';
import { Connection } from 'src/app/interfaces/profile';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-match-options',
  templateUrl: './match-options.component.html',
  styleUrls: ['./match-options.component.scss'],
})
export class MatchOptionsComponent implements OnInit {

  @Input() connection: Connection;

  constructor(private popoverCtrl: PopoverController) { }

  ngOnInit() {
  }

  blockButton() {
    this.close({block: true});
  }

  close(data?: any) {
    this.popoverCtrl.dismiss(data).catch(error => console.error(error));
  }

}
