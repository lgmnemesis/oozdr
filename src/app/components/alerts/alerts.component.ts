import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { AlertsService } from 'src/app/services/alerts.service';
import { Alert } from 'src/app/interfaces/general';

@Component({
  selector: 'app-alerts',
  templateUrl: './alerts.component.html',
  styleUrls: ['./alerts.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AlertsComponent implements OnInit, OnDestroy {

  @Input() isVisible = false;

  _alerts: Subscription;

  alerts: Alert[];
  closedAlertId: string;

  constructor(private cd: ChangeDetectorRef,
    private alertsService: AlertsService) { }

  ngOnInit() {
    this._alerts = this.alertsService.getAlertsAsObservable().subscribe((alerts) => {
      this.alerts = alerts;
      this.markForCheck();
    })
  }

  markForCheck() {
    this.cd.markForCheck();
  }

  dismissAlert(alert: Alert) {
    this.closedAlertId = alert.id;
    this.alertsService.dismissAlert(alert);
    this.markForCheck();
  }

  acceptAlert(alert: Alert) {
    this.closedAlertId = alert.id;
    this.alertsService.acceptAlert(alert);
    this.markForCheck();
  }

  trackById(i, message) {
    return message.id;
  }

  ngOnDestroy() {
    if (this._alerts) this._alerts.unsubscribe();
  }
}
