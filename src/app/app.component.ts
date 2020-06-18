// provisioning file
import { Component, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Platform } from '@ionic/angular';
import { SharedService } from './services/shared.service';
import { SwUpdate } from '@angular/service-worker';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {

  constructor(
    private platform: Platform,
    private sharedService: SharedService,
    private swUpdate: SwUpdate,
    private cd: ChangeDetectorRef,
  ) {
    this.initializeApp();
  }

  markForCheck() {
    this.cd.markForCheck();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.subscribeToVersionUpdate();
      this.sharedService.showInfo();
    });
  }

  subscribeToVersionUpdate() {
    if (this.swUpdate.isEnabled) {
      this.swUpdate.available.subscribe((update) => {
        console.log(
          'New version is available and will be active on the next reload/refresh', update
        );
      });
    }
  }

}
