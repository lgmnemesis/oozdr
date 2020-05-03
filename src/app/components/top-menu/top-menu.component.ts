import { Component, OnInit, Input, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { SharedStoreService } from 'src/app/services/shared-store.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

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
        this.sharedStoreService.activeMenuSubject.next(this.menu3);
        this.sharedStoreService.activeTopMenu = this.menu2;
      }
    } else {
      if (this.activeMenu === this.menu3) {
        this.sharedStoreService.activeTopMenu = this.menu3;
      }
    }
    this.markForCheck();
  }

  @Input() showChat = true;
  @Input() isLarge = true;

  activeMenu: string;
  _activeMenu: Subscription;
  isVisible = false;
  useToggle = false;
  
  menu1 = 'profile';
  menu2 = 'connections';
  menu3 = 'matches';

  constructor(private cd: ChangeDetectorRef,
    public sharedStoreService: SharedStoreService,
    private router: Router) { }

  ngOnInit() {
    this._activeMenu = this.sharedStoreService.activeMenu$.subscribe((active) => {
      this.activeMenu = active;
      this.markForCheck();
    });
  }

  markForCheck() {
    this.cd.markForCheck();
  }

  clickedOn(url: string) {
    if (this.sharedStoreService.activeTopMenu !== url) {
      this.sharedStoreService.activeTopMenu = url;
      this.sharedStoreService.activeMenuSubject.next(url);
      this.goto(url);
    }
  }

  toggleMenus() {
    if (this.sharedStoreService.activeTopMenu === this.menu1) {
      this.sharedStoreService.activeTopMenu = this.menu2;
    } else {
      this.sharedStoreService.activeTopMenu = this.menu1
    }
    this.goto(this.sharedStoreService.activeTopMenu);
  }

  goto(url) {
    this.router.navigate([url]).catch(error => console.error(error));
  }
}
