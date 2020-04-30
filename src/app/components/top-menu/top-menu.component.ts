import { Component, OnInit, Input, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { SharedStoreService } from 'src/app/services/shared-store.service';
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
    this.isVisible = is;
    if (is) {
      if (this.sharedStoreService.activeTopMenu === this.menu3) {
        this.sharedStoreService.activeMenu = this.menu3;
        this.sharedStoreService.activeTopMenu = this.menu2;
      }
    } else {
      if (this.sharedStoreService.activeMenu === this.menu3) {
        this.sharedStoreService.activeTopMenu = this.menu3;
      }
    }
    this.markForCheck();
  }

  @Input() showChat = true;
  @Input() isLarge = true;

  isVisible = false;
  useToggle = false;
  
  menu1 = 'profile';
  menu2 = 'connections';
  menu3 = 'matches';

  constructor(private cd: ChangeDetectorRef,
    public sharedStoreService: SharedStoreService,
    private router: Router) { }

  ngOnInit() {
  }

  markForCheck() {
    this.cd.markForCheck();
  }

  clickedOn(url: string) {
    if (this.sharedStoreService.activeTopMenu !== url) {
      this.sharedStoreService.activeTopMenu = url;
      this.sharedStoreService.activeMenu = url;
      this.goto(url);
    }
  }

  toggleMenus() {
    console.log('active1:', this.sharedStoreService.activeTopMenu);
    if (this.sharedStoreService.activeTopMenu === this.menu1) {
      this.sharedStoreService.activeTopMenu = this.menu2;
    } else {
      this.sharedStoreService.activeTopMenu = this.menu1
    }
    console.log('active2:', this.sharedStoreService.activeTopMenu);
    this.goto(this.sharedStoreService.activeTopMenu);
  }

  goto(url) {
    this.router.navigate([url]).catch(error => console.error(error));
  }
}
