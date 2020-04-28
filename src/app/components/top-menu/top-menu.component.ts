import { Component, OnInit, Input, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { SharedStatesService } from 'src/app/services/shared-states.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-top-menu',
  templateUrl: './top-menu.component.html',
  styleUrls: ['./top-menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TopMenuComponent implements OnInit {

  @Input()
  set visible(is: boolean) {
    if (is) {
      if (this.sharedStatesService.activeTopMenu === this.menu3) {
        this.sharedStatesService.activeMenu = this.menu3;
        this.sharedStatesService.activeTopMenu = this.menu2;
      }
    } else {
      if (this.sharedStatesService.activeMenu === this.menu3) {
        this.sharedStatesService.activeTopMenu = this.menu3;
      }
    }
    this.markForCheck();
  }

  @Input() showChat = true;
  @Input() isLarge = true;

  menu1 = 'profile';
  menu2 = 'connections';
  menu3 = 'matches';

  constructor(private cd: ChangeDetectorRef,
    public sharedStatesService: SharedStatesService,
    private router: Router) { }

  ngOnInit() {
  }

  markForCheck() {
    this.cd.markForCheck();
  }

  clickedOn(url: string) {
    if (this.sharedStatesService.activeTopMenu !== url) {
      this.sharedStatesService.activeTopMenu = url;
      this.sharedStatesService.activeMenu = url;
      this.goto(url);
    }
  }

  goto(url) {
    this.router.navigate([url]).catch(error => console.error(error));
  }
}
