import { Component, OnInit, Input } from '@angular/core';
import { Connection } from 'src/app/interfaces/profile';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-match-details',
  templateUrl: './match-details.component.html',
  styleUrls: ['./match-details.component.scss'],
})
export class MatchDetailsComponent implements OnInit {

  @Input() connection: Connection;

  constructor(private popoverCtrl: PopoverController) { }

  ngOnInit() {}

  close(data?: any) {
    this.popoverCtrl.dismiss(data).catch(error => console.error(error));
  }
}
