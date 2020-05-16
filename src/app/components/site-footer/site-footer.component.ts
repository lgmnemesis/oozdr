import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-site-footer',
  templateUrl: './site-footer.component.html',
  styleUrls: ['./site-footer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SiteFooterComponent implements OnInit {

  constructor(private router: Router,
    private popoverCtrl: PopoverController ) { }

  ngOnInit() {}

  gotoPrivacy() {
    this.goto('privacy');
  }

  gotoTerms() {
    this.goto('terms');
  }

  goto(url: string) {
    this.popoverCtrl.dismiss().catch(error => console.error(error));
    this.router.navigate([url]).catch(error => console.error(error));
  }

}
