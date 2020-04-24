import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-welcome-container',
  templateUrl: './welcome-container.component.html',
  styleUrls: ['./welcome-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WelcomeContainerComponent implements OnInit {

  step = 2;
  isBack = false;
  isNext = false;

  constructor(private cd: ChangeDetectorRef,
    private navCtrl: NavController) { }

  ngOnInit() {
  }

  markForCheck() {
    this.cd.markForCheck();
  }

  back() {
    this.step--;
    this.isBack = true;
    this.isNext = false;
    if (this.step < 1) {
      // goto start
      this.gotoStart();
    }
    this.markForCheck();
  }

  next() {
    this.step++;
    this.isBack = false;
    this.isNext = true;
    console.log('moshe next:', this.step);
    this.markForCheck();
  }

  gotoStart() {
    this.navCtrl.navigateRoot('/start')
    .catch((error) => {
      console.error(error);
    });
  }

}
