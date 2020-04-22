import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-welcome-container',
  templateUrl: './welcome-container.component.html',
  styleUrls: ['./welcome-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WelcomeContainerComponent implements OnInit {

  name = '';
  gender = '';
  email = '';
  birthday = '';

  nameError = 'no errors';
  isNameError = false;
  genderError = 'no errors';
  isGenderError = false;
  emailError = 'no errors';
  isEmailError = false;
  birthdayError = 'no errors';
  isBirthdayError = false;

  constructor() { }

  ngOnInit() {
  }

  setName(event) {
    this.name = event.detail.value;
    this.isValidName();
  }

  setGender(gender: string) {
    this.gender = gender;
    this.genderError = 'no errors';
    this.isGenderError = false;
  }

  setEmail(event) {
    this.email = event.detail.value;
    this.isValidEmail();
  }

  setBirthday(event) {
    this.birthday = event.detail.value;
    this.isValidBirthday();
  }

  nextStep() {
    if (this.isValidatedForm()) {

    }
  }

  isValidName() {
    this.nameError = 'no errors';
    this.isNameError = false;
    const name = this.name.trim();
    if (!name) {
      this.nameError = 'Please enter your name';
      this.isNameError = true;      
    } else if (!name.match(/^[a-zA-Z ]+$/)) {
      this.nameError = 'Only Letters please';
      this.isNameError = true;
    } else if (name.length < 2) {
      this.nameError = 'Sorry, name is too short';
      this.isNameError = true;
    }
  }

  isValidGender() {
    this.genderError = 'no errors';
    this.isGenderError = false;
    if (this.gender === '') {
      this.genderError = 'Please select a gender';
      this.isGenderError = true;
    }
  }

  isValidEmail() {
    this.emailError = 'no errors';
    this.isEmailError = false;
    const email = this.email.trim();
    if (!email) {
      this.emailError = 'Please enter your email';
      this.isEmailError = true;      
    } else if (!email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)) {
      this.emailError = 'Invalid email address';
      this.isEmailError = true;
    }
  }

  isValidBirthday() {
    this.birthdayError = 'no errors';
    this.isBirthdayError = false;
    const birthday = this.birthday.trim();
    if (!birthday) {
      this.birthdayError = 'Please enter your birthday';
      this.isBirthdayError = true;   
    }
  }

  isValidatedForm() {
    this.isValidName();
    this.isValidGender();
    this.isValidEmail();
    this.isValidBirthday();
    const isValidated = !this.isNameError && !this.isGenderError && !this.isEmailError && !this.isBirthdayError;
    console.log('isValidated:', isValidated);
    return isValidated;
  }
}
