import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-support-page',
  templateUrl: './support.page.html',
  styleUrls: ['./support.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SupportPage implements OnInit {

  useBackIcon = true;

  constructor(private sharedService: SharedService) { }

  ngOnInit() {
    if (this.sharedService.currentUrlPath !== 'support') {
      this.useBackIcon = false;
    }
  }

}
