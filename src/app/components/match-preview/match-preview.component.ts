import { Component, OnInit, Input, ChangeDetectionStrategy, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { Connection } from 'src/app/interfaces/profile';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-match-preview',
  templateUrl: './match-preview.component.html',
  styleUrls: ['./match-preview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MatchPreviewComponent implements OnInit {

  @Input() 
  set isActive(is: boolean) {
    this.isActiveMatch = is;
    this.markForCheck();
  }
  @Input() connection: Connection;
  @Output() buttonEvent = new EventEmitter;

  isActiveMatch = false;
  defaultProfileImg =  this.sharedService.defaultProfileImg;
  

  constructor(private cd: ChangeDetectorRef,
    private sharedService: SharedService) {}

  ngOnInit() {
  }

  markForCheck() {
    this.cd.markForCheck();
  }

  selectedMatchButton() {
    this.buttonEvent.next(true);
  }
}
