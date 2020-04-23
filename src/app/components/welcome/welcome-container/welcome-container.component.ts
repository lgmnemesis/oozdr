import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-welcome-container',
  templateUrl: './welcome-container.component.html',
  styleUrls: ['./welcome-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WelcomeContainerComponent implements OnInit {

  step = 1;

  constructor(private cd: ChangeDetectorRef) { }

  ngOnInit() {
  }

  markForCheck() {
    this.cd.markForCheck();
  }

  back() {
    this.step--;
    this.markForCheck();
  }

  next() {
    this.step++;
    console.log('moshe next:', this.step);
    this.markForCheck();
  }

}
