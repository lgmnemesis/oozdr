import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { LocaleService } from 'src/app/services/locale.service';

@Component({
  selector: 'app-site-footer',
  templateUrl: './site-footer.component.html',
  styleUrls: ['./site-footer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SiteFooterComponent implements OnInit {

  dictionary = this.localeService.dictionary;
  dictFooter = this.dictionary.siteFooterComponent;

  constructor(private router: Router,
    private localeService: LocaleService) { }

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
