import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-privacy',
  templateUrl: './privacy.page.html',
  styleUrls: ['./privacy.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PrivacyPage implements OnInit {

  useBackIcon = true;

  constructor(private sharedService: SharedService) { }

  ngOnInit() {
    if (this.sharedService.currentUrlPath !== 'privacy') {
      this.useBackIcon = false;
    }
  }

}
