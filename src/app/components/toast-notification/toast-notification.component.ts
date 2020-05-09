import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef, Input } from '@angular/core';
import { SharedStoreService } from 'src/app/services/shared-store.service';
import { Subscription } from 'rxjs';
import { ToastMessage } from 'src/app/interfaces/toast-message';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-toast-notification',
  templateUrl: './toast-notification.component.html',
  styleUrls: ['./toast-notification.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ToastNotificationComponent implements OnInit, OnDestroy {

  @Input() id = null;
  @Input() hide = false;

  toastNotificationsStoragePerfix = this.sharedService.toastNotificationsStoragePerfix;
  message: ToastMessage
  _toastNotifications: Subscription;
  isLocked = false;

  constructor(private sharedStoreService: SharedStoreService,
    private cd: ChangeDetectorRef,
    private sharedService: SharedService) { }

  ngOnInit() {
    this._toastNotifications = this.sharedStoreService.toastNotifications$.subscribe((message) => {
      if (message && message.id === this.id) {
        this.message = message;
        if (!this.isLocked && message.isVisible && message.duration && message.duration > 0) {
          this.isLocked = true;
          const msg = this.cloneMessage();
          setTimeout(() => {
            this.dismiss(msg);
            this.isLocked = false;
          }, message.duration);
        }
        this.markForCheck();
      }
    });
  }

  markForCheck() {
    this.cd.markForCheck();
  }

  getStoragePath() {
    return `${this.toastNotificationsStoragePerfix}${this.id}`;
  }
  cloneMessage() {
    return JSON.parse(JSON.stringify(this.message));
  }
  
  clicked() {
    const message = this.cloneMessage();
    this.dismiss(message);
  }

  dismiss(message: ToastMessage) {
    message.isVisible = false;
    this.sharedStoreService.toastNotificationsSubject.next(message);
    try {
      localStorage.setItem(`${this.getStoragePath()}`,'true');
    } catch (error) {
      console.error(error);
    }
  }

  ngOnDestroy() {
    if (this._toastNotifications) {
      this._toastNotifications.unsubscribe();
    }
  }
}
