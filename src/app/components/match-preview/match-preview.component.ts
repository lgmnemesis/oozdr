import { Component, OnInit, Input, ChangeDetectionStrategy, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { Connection } from 'src/app/interfaces/profile';

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
  @Input() inViewMode = false;
  @Output() buttonEvent = new EventEmitter;

  isActiveMatch = false;
  defaultProfileImg =  '../../../assets/images/profile-def.png';

  constructor(private cd: ChangeDetectorRef) {}

  ngOnInit() {
  }

  markForCheck() {
    this.cd.markForCheck();
  }

  selectedMatchButton() {
    this.buttonEvent.next(true);
  }
}
