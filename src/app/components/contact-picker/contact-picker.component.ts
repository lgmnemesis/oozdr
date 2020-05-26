import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ContactPickerApiService } from 'src/app/services/contact-picker-api.service';

@Component({
  selector: 'app-contact-picker',
  templateUrl: './contact-picker.component.html',
  styleUrls: ['./contact-picker.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContactPickerComponent implements OnInit {

  contacts;

  constructor(private contactPickerApiService: ContactPickerApiService,
    private cd: ChangeDetectorRef) { }

  ngOnInit() {}

  markForCheck() {
    this.cd.markForCheck();
  }

  async getContacts() {
    this.contacts = await this.contactPickerApiService.getContacts();
    this.markForCheck();
  }
}
