import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-terms',
  templateUrl: './terms.page.html',
  styleUrls: ['./terms.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TermsPage implements OnInit {

  useBackIcon = true;

  constructor(private sharedService: SharedService) { }

  ngOnInit() {
    if (this.sharedService.currentUrlPath !== 'terms') {
      this.useBackIcon = false;
    }
  }

}
