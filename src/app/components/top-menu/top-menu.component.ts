import { Component, OnInit, Input, ChangeDetectionStrategy, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';
import { SharedStatesService } from 'src/app/services/shared-states.service';

@Component({
  selector: 'app-top-menu',
  templateUrl: './top-menu.component.html',
  styleUrls: ['./top-menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TopMenuComponent implements OnInit {

  @Input() showChat = true;
  @Input() isLarge = true;
  @Output() menuEvent = new EventEmitter();

  constructor(private cd: ChangeDetectorRef,
    public sharedStatesService: SharedStatesService) { }

  ngOnInit() {
  }

  markForCheck() {
    this.cd.markForCheck();
  }

  clickedOn(on: string) {
    if (this.sharedStatesService.activeTopMenu !== on) {
      this.sharedStatesService.activeTopMenu = on;
      this.menuEvent.next({selected: on});
    }
  }
}
