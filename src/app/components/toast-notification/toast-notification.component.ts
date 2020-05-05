import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef, Input } from '@angular/core';
import { SharedStoreService } from 'src/app/services/shared-store.service';
import { Subscription } from 'rxjs';
import { ToastMessage } from 'src/app/interfaces/toast-message';

@Component({
  selector: 'app-toast-notification',
  templateUrl: './toast-notification.component.html',
  styleUrls: ['./toast-notification.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ToastNotificationComponent implements OnInit, OnDestroy {

  @Input() id = null;

  message: ToastMessage
  _toastNotifications: Subscription;
  isLocked = false;

  constructor(private sharedStoreService: SharedStoreService,
    private cd: ChangeDetectorRef) { }

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
      localStorage.setItem(`toast-notif-${this.id}`, 'true');
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
