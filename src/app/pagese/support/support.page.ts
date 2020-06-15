import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { SharedService } from 'src/app/services/shared.service';
import { NavController } from '@ionic/angular';
import { LocaleService } from 'src/app/services/locale.service';

@Component({
  selector: 'app-support-page',
  templateUrl: './support.page.html',
  styleUrls: ['./support.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SupportPage implements OnInit {

  useBackIcon = true;
  dictionary = this.localeService.dictionary;
  dictSupport = this.dictionary.supportPage;

  constructor(private sharedService: SharedService,
    private navCtrl: NavController,
    private localeService: LocaleService) { }

  ngOnInit() {
    if (this.sharedService.currentUrlPath !== 'support') {
      this.useBackIcon = false;
    }
  }

  goBack() {
    this.navCtrl.back();
  }

}
