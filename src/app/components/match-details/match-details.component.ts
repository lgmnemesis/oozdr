import { Component, OnInit, Input } from '@angular/core';
import { Connection } from 'src/app/interfaces/profile';
import { PopoverController } from '@ionic/angular';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-match-details',
  templateUrl: './match-details.component.html',
  styleUrls: ['./match-details.component.scss'],
})
export class MatchDetailsComponent implements OnInit {

  @Input() connection: Connection;
  defaultProfileImg = this.sharedService.defaultProfileImg;

  constructor(private popoverCtrl: PopoverController,
    private sharedService: SharedService) { }

  ngOnInit() {}

  close(data?: any) {
    this.popoverCtrl.dismiss(data).catch(error => console.error(error));
  }
}
