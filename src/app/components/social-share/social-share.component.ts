import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-social-share',
  templateUrl: './social-share.component.html',
  styleUrls: ['./social-share.component.scss'],
})
export class SocialShareComponent implements OnInit {

  navigatorShareSupport = false;

  constructor() { }

  ngOnInit() {
    const nav: any = navigator;
    this.navigatorShareSupport = nav.share;
  }

  shareOnWhatsapp() {

  }

  shareOnFacebook() {

  }

  shareOnTwitter() {

  }

  shareWithMail() {

  }
  
  copyLink() {

  }

  async navigatorShare() {
    const nav: any = navigator;
    const share = {
      url: 'https://reconnect.page.link/invite',
      title: 'App recommendation for you.',
      text: 'This app has helped me to reconnect with some one dear and i think it can help you as well.'
    }
    try {
      await nav.share(share);
      console.log('Thanks for sharing!')
    } catch (error) {
      console.error('Could not share!', error);
    }
  }

}
