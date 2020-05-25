import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { SharedService } from 'src/app/services/shared.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-support-page',
  templateUrl: './support.page.html',
  styleUrls: ['./support.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SupportPage implements OnInit {

  useBackIcon = true;

  constructor(private sharedService: SharedService,
    private navCtrl: NavController) { }

  ngOnInit() {
    if (this.sharedService.currentUrlPath !== 'support') {
      this.useBackIcon = false;
    }
  }

  goBack() {
    this.navCtrl.back();
  }

}
