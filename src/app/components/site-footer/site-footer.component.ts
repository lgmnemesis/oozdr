import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-site-footer',
  templateUrl: './site-footer.component.html',
  styleUrls: ['./site-footer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SiteFooterComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {}

  gotoPrivacy() {
    this.goto('privacy');
  }

  gotoTerms() {
    this.goto('terms');
  }

  gotoContact() {
    this.goto('contact');
  }

  gotoSupport() {
    this.goto('support');
  }

  gotoAbout() {
    this.goto('about');
  }

  goto(url: string) {
    this.router.navigate([url]).catch(error => console.error(error));
  }
}
