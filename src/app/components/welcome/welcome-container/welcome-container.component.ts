import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-welcome-container',
  templateUrl: './welcome-container.component.html',
  styleUrls: ['./welcome-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WelcomeContainerComponent implements OnInit {

  name = '';
  email = '';
  selectedGender = '';

  constructor() { }

  ngOnInit() {}

  setGender(gender: string) {
    this.selectedGender = gender;
  }

  nextStep() {
    if (this.isValidatedForm()) {

    }
  }

  isValidatedForm() {
    const isValidated = false;
    return isValidated;
  }
}
