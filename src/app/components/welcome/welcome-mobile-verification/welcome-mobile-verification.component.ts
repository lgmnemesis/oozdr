import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-welcome-mobile-verification',
  templateUrl: './welcome-mobile-verification.component.html',
  styleUrls: ['./welcome-mobile-verification.component.scss'],
})
export class WelcomeMobileVerificationComponent implements OnInit {

  @Input() isNext = false;
  @Input() isBack = false;

  constructor() { }

  ngOnInit() {}

}
