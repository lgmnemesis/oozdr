import { Component, OnInit, OnDestroy, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { ProvStoreService } from '../../services/prov-store.service';
import { Subscription } from 'rxjs';
import { UserData } from '../../interfaces/general';

@Component({
  selector: 'app-prov-start',
  templateUrl: './prov-start.page.html',
  styleUrls: ['./prov-start.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProvStartPage implements OnInit, OnDestroy {

  _usersData: Subscription;
  usersData: UserData[];

  constructor(private provStoreService: ProvStoreService,
    private cd: ChangeDetectorRef) { }

  ngOnInit() {
    this.provStoreService.registerAllUsersRelatedData(100);
    this._usersData = this.provStoreService.usersData$.subscribe((data) => {
      this.usersData = data;
      this.markForCheck();
    })
  }

  markForCheck() {
    this.cd.markForCheck();
  }

  ngOnDestroy() {
    if (this._usersData) this._usersData.unsubscribe();
  }
}
