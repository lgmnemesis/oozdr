import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { LocaleService } from 'src/app/services/locale.service';
import { SharedStoreService } from 'src/app/services/shared-store.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-why-oozdr',
  templateUrl: './why-oozdr.component.html',
  styleUrls: ['./why-oozdr.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WhyOozdrComponent implements OnInit, OnDestroy {

  _markForCheckApp: Subscription;
  dictionary = this.localeService.dictionary;
  dictWhy = this.dictionary.whyOozdrComponent;
  
  constructor(private localeService: LocaleService,
    private sharedStoreService: SharedStoreService,
    private cd: ChangeDetectorRef) { }

  ngOnInit() {
    this._markForCheckApp = this.sharedStoreService.markForCheckApp$.subscribe((mark) => {
      if (mark) {
        this.dictionary = this.localeService.dictionary;
        this.dictWhy = this.dictionary.whyOozdrComponent;
        this.markForCheck();
      }
    })
  }

  markForCheck() {
    this.cd.markForCheck();
  }

  ngOnDestroy() {
    if (this._markForCheckApp) this._markForCheckApp.unsubscribe();
  }
}
