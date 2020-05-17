import { Component, OnInit } from '@angular/core';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-contact-links',
  templateUrl: './contact-links.component.html',
  styleUrls: ['./contact-links.component.scss'],
})
export class ContactLinksComponent implements OnInit {

  constructor(private sharedService: SharedService) { }

  ngOnInit() {}

  mailTo() {
    const url = `mailto:contact@reqonneqt.com`;
    this.sharedService.openNewWindow(url);
  }

  openTwitter() {
    const url = 'https://twitter.com/reqonneqt';
    this.openNewTab(url);
  }

  openFaceBook() {
    const url = 'https://www.facebook.com/Reqonneqt';
    this.openNewTab(url);
  }

  openNewTab(url: string, params = '') {
    try {
      window.open(url, '', params);
    } catch (error) {
      console.error(error);
    }
  }
}
