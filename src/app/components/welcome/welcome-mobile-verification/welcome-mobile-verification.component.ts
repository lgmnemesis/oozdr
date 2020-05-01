import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-welcome-mobile-verification',
  templateUrl: './welcome-mobile-verification.component.html',
  styleUrls: ['./welcome-mobile-verification.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WelcomeMobileVerificationComponent implements OnInit {

  @Input() isNext = false;
  @Input() isBack = false;

  @Output() processDone = new EventEmitter();

  constructor() { }

  ngOnInit() {}

  processDoneClick(event) {
    if (event.disableBackButton) {
      this.processDone.next(true);
    }
  }
}
