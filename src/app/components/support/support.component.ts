import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { LocaleService } from 'src/app/services/locale.service';

@Component({
  selector: 'app-support',
  templateUrl: './support.component.html',
  styleUrls: ['./support.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SupportComponent implements OnInit {

  supportImg = 1;
  dictionary = this.localeService.dictionary;
  dictSupport = this.dictionary.supportComponent;
  dictSupportTxt = this.dictionary.supportTxt;

  constructor(private cd: ChangeDetectorRef,
    public localeService: LocaleService) { }

  ngOnInit() {}

  markForCheck() {
    this.cd.markForCheck();
  }

  showSupportImg(img: number) {
    this.supportImg = img;
  }
}
