import { Injectable } from '@angular/core';
import { SharedStoreService } from './shared-store.service';
import { Observable } from 'rxjs';
import { Alert } from '../interfaces/general';
import { take } from 'rxjs/operators';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AlertsService {

  constructor(private sharedStoreService: SharedStoreService,
    private loadingCtrl: LoadingController) { }

  getAlertsAsObservable(): Observable<Alert[]> {
    return this.sharedStoreService.alerts$;
  }

  getAlerts(): Promise<Alert[]> {
    return this.getAlertsAsObservable().pipe(take(1)).toPromise();
  }

  async addAlert(alert: Alert) {
    if (!alert) {
      return;
    }
    let alerts = await this.getAlerts();
    if (!alerts) alerts = [];
    alerts.push(alert);
    this.sharedStoreService.alertsSubject.next(alerts);
  }

  async removeAlert(alert: Alert) {
    if (!alert) {
      return;
    }
    let alerts = await this.getAlerts();
    if (alerts) {
      const redused = alerts.filter(al => al.id !== alert.id);
      if (alert.action && alert.action.delay && alert.action.delay > 0) {
        setTimeout(() => {
          this.sharedStoreService.alertsSubject.next(redused);    
        }, alert.action.delay);
      } else {
        this.sharedStoreService.alertsSubject.next(redused);
      }
    }
  }

  sendNewVersionAlert() {
    const alert: Alert = {
      id: this.sharedStoreService.createId(),
      title: 'New version available',
      content: 'Please refresh to reload the new version.',
      dismissText: 'Dismiss',
      okText: 'Refresh',
      action: {
        actionName: 'new_version',
        isAction: true,
        delay: 800
      }
    }
    this.addAlert(alert);
  }

  dismissAlert(alert: Alert) {
    this.removeAlert(alert);
  }

  acceptAlert(alert: Alert) {
    if (alert.action && alert.action.isAction) {
      if (alert.action.actionName === 'new_version') {
        this.presentReloadingVersion();
        setTimeout(() => {
          try {
            location.reload();
          } catch (error) {
            console.error(error);
          }
        }, 2000);
      }
      this.removeAlert(alert);
    }
  }

  async presentReloadingVersion() {
    const loading = await this.loadingCtrl.create({
      message: 'Reloading new version...',
      duration: 7000,
      mode: 'ios'
    });
    await loading.present();

    const { role, data } = await loading.onDidDismiss();
  }
}
