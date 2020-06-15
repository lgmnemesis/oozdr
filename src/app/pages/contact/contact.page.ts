import { Component, OnInit } from '@angular/core';
import { SharedService } from 'src/app/services/shared.service';
import { NavController } from '@ionic/angular';
import { LocaleService } from 'src/app/services/locale.service';

@Component({
  selector: 'app-contact-page',
  templateUrl: './contact.page.html',
  styleUrls: ['./contact.page.scss'],
})
export class ContactPage implements OnInit {

  useBackIcon = true;
  dictionary = this.localeService.dictionary;
  dictContact = this.dictionary.contactPage;

  constructor(private sharedService: SharedService,
    private navCtrl: NavController,
    private localeService: LocaleService) { }

  ngOnInit() {
    if (this.sharedService.currentUrlPath !== 'contact') {
      this.useBackIcon = false;
    }
  }

  goBack() {
    this.navCtrl.back();
  }
}
