import { Component, OnInit, Input, ChangeDetectionStrategy, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { SharedStoreService } from 'src/app/services/shared-store.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-top-menu',
  templateUrl: './top-menu.component.html',
  styleUrls: ['./top-menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TopMenuComponent implements OnInit, OnDestroy {

  @Input()
  set visible(is: boolean) {
    this.isVisible = is;
    if (is) {
      if (this.sharedStoreService.activeTopMenu === this.sharedService.menu3) {
        this.sharedStoreService.activeMenuSubject.next(this.sharedService.menu3);
        this.sharedStoreService.activeTopMenu = this.sharedService.menu2;
      }
    } else {
      if (this.activeMenu === this.sharedService.menu3) {
        this.sharedStoreService.activeTopMenu = this.sharedService.menu3;
      }
    }
    this.markForCheck();
  }

  @Input() showChat = true;
  @Input() isLarge = true;

  _activeMenu: Subscription;
  _newMatchesIndicator: Subscription;

  activeMenu: string;
  isVisible = false;
  useToggle = false;
  isNewMatches = false;

  constructor(private cd: ChangeDetectorRef,
    public sharedStoreService: SharedStoreService,
    public sharedService: SharedService,
    private router: Router) { }

  ngOnInit() {
    this._activeMenu = this.sharedStoreService.activeMenu$.subscribe((active) => {
      this.activeMenu = active;
      if (active === this.sharedService.menu3 && !this.isVisible) {
        this.sharedStoreService.activeTopMenu = this.sharedService.menu3;
      } else if (active === this.sharedService.menu3) {
        this.sharedStoreService.activeTopMenu = this.sharedService.menu2;
      }
      this.markForCheck();
    });

    this._newMatchesIndicator = this.sharedStoreService.newMatchesIndicator$.subscribe((isNew) => {
      this.isNewMatches = isNew;
      this.markForCheck();
    });
  }

  markForCheck() {
    this.cd.markForCheck();
  }

  clickedOn(url: string) {
    this.sharedStoreService.activeTopMenu = url;
    this.sharedStoreService.activeMenuSubject.next(url);
    this.goto(url);
  }

  toggleMenus() {
    if (this.sharedStoreService.activeTopMenu === this.sharedService.menu1) {
      this.sharedStoreService.activeTopMenu = this.sharedService.menu2;
    } else {
      this.sharedStoreService.activeTopMenu = this.sharedService.menu1
    }
    this.goto(this.sharedStoreService.activeTopMenu);
  }

  goto(url) {
    this.router.navigate([url]).catch(error => console.error(error));
  }

  ngOnDestroy() {
    if (this._activeMenu) this._activeMenu.unsubscribe();
    if (this._newMatchesIndicator) this._newMatchesIndicator.unsubscribe();
  }
}
