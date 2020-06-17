import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { SharedService } from 'src/app/services/shared.service';
import { NavController } from '@ionic/angular';
import { LocaleService } from 'src/app/services/locale.service';

@Component({
  selector: 'app-privacy',
  templateUrl: './privacy.page.html',
  styleUrls: ['./privacy.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PrivacyPage implements OnInit {

  useBackIcon = true;

  constructor(private sharedService: SharedService,
    private navCtrl: NavController,
    public localeService: LocaleService) { }

  ngOnInit() {
    if (this.sharedService.currentUrlPath !== 'privacy') {
      this.useBackIcon = false;
    }
  }

  goBack() {
    if (this.useBackIcon) {
      this.navCtrl.back();
    } else {
      this.navCtrl.navigateBack('/');
    }
  }

}
