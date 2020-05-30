import { Component, OnInit } from '@angular/core';
import { SharedService } from 'src/app/services/shared.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-contact-page',
  templateUrl: './contact.page.html',
  styleUrls: ['./contact.page.scss'],
})
export class ContactPage implements OnInit {

  useBackIcon = true;

  constructor(private sharedService: SharedService,
    private navCtrl: NavController) { }

  ngOnInit() {
    if (this.sharedService.currentUrlPath !== 'contact') {
      this.useBackIcon = false;
    }
  }

  goBack() {
    this.navCtrl.back();
  }
}
