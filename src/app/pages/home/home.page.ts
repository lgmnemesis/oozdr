import { Component, OnInit, OnDestroy } from '@angular/core';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {

  constructor(private sharedService: SharedService) { }

  ngOnInit() {
    this.sharedService.splitPaneSubject.next(true);
  }

  ngOnDestroy() {
    this.sharedService.splitPaneSubject.next(false);
  }
}
