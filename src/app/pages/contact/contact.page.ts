import { Component, OnInit } from '@angular/core';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-contact-page',
  templateUrl: './contact.page.html',
  styleUrls: ['./contact.page.scss'],
})
export class ContactPage implements OnInit {

  useBackIcon = true;

  constructor(private sharedService: SharedService) { }

  ngOnInit() {
    if (this.sharedService.currentUrlPath !== 'contact') {
      this.useBackIcon = false;
    }
  }
}
