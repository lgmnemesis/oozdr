import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-social-share',
  templateUrl: './social-share.component.html',
  styleUrls: ['./social-share.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SocialShareComponent implements OnInit {

  navigatorShareSupport = false;
  copyiedToClipboard = false;

  share = {
    url: 'https://reconnect.page.link/invite',
    title: 'App recommendation for you. ',
    text: 'This app has helped me to reconnect with someone dear and I think it can help you as well.'
  }

  copyToClipboard = (str: string) => {
    const el = document.createElement('textarea');
    el.value = str;
    el.setAttribute('readonly', '');
    el.style.position = 'absolute';                 
    el.style.left = '-9999px';      
    document.body.appendChild(el);  
    const selected =            
      document.getSelection().rangeCount > 0
        ? document.getSelection().getRangeAt(0) 
        : false;                                
    el.select();                                
    document.execCommand('copy');               
    document.body.removeChild(el);                  
    if (selected) {                                 
      document.getSelection().removeAllRanges();    
      document.getSelection().addRange(selected);  
    }
  }

  constructor(private sharedService: SharedService,
    private cd: ChangeDetectorRef) { }

  ngOnInit() {
    const nav: any = navigator;
    this.navigatorShareSupport = nav.share;
  }

  markForCheck() {
    this.cd.markForCheck();
  }

  shareOnWhatsapp() {
    const base_url = 'https://web.whatsapp.com/send?';
    const encodedUrl = encodeURIComponent(this.share.url);
    const encodedDescription = encodeURIComponent(`${this.share.title}\n${this.share.text}\n`);
    const url = `${base_url}text=${encodedDescription}${encodedUrl}`;
    this.openNewWindow(url, 600);
  }

  shareOnFacebook() {
    const base_url = 'https://www.facebook.com/sharer/sharer.php?';
    const encodedUrl = encodeURIComponent(this.share.url);
    const url = `${base_url}u=${encodedUrl}`;
    this.openNewWindow(url, 800);
  }

  shareOnTwitter() {
    // const base_url = 'https://twitter.com/intent/tweet?'; // post to all
    const base_url = 'https://twitter.com/messages/compose?'; // Direct Message to selected users
    const encodedText = encodeURIComponent(`${this.share.title}\n${this.share.text}\n`);
    const encodedUrl = encodeURIComponent(this.share.url);
    const url = `${base_url}url=${encodedUrl}&text=${encodedText}${encodedUrl}`;
    this.openNewWindow(url, 600);
  }

  shareWithMail() {
    const body = encodeURIComponent(`${this.share.text}\n${this.share.url}\n`);
    const url = `mailto:?subject=${this.share.title}&body=${body}`;
    this.openNewWindow(url);
  }
  
  copyLink() {
    this.copyToClipboard(this.share.url);
    this.copyiedToClipboard = true;
    setTimeout(() => {
      this.copyiedToClipboard = false;
      this.markForCheck();
    }, 1600);
  }

  async navigatorShare() {
    const nav: any = navigator;
    try {
      await nav.share(this.share);
    } catch (error) {
      console.error('Could not share!', error);
    }
  }

  openNewWindow(url: string, windowHeight = 300): Window {
    const width = window.innerWidth;
    const height = window.innerHeight;
    let w: number, left: number;
    try {
      if (width < this.sharedService.MEDIUM_WINDOW_WIDTH) {
        w = width - 20;
        left = 0;
      } else {
        w = this.sharedService.MEDIUM_WINDOW_WIDTH;
        left = Number((width / 2) - (w / 2));
      }
      const h = windowHeight;
      const top = Number((height / 2)  - (h / 2));
      const params = `scrollbars=no,resizable=no,
      status=no,location=no,toolbar=no,menubar=no,
      width=${w},height=${h},left=${left},top=${top}`;
      return window.open(url, '', params);
    } catch (error) {
      console.error(error);
    }
  }


}
