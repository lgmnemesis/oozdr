import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-support',
  templateUrl: './support.component.html',
  styleUrls: ['./support.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SupportComponent implements OnInit {

  supportImg = 1;

  constructor(private cd: ChangeDetectorRef) { }

  ngOnInit() {}

  markForCheck() {
    this.cd.markForCheck();
  }

  showSupportImg(img: number) {
    this.supportImg = img;
  }
}
