import { Injectable } from '@angular/core';
import { SharedStoreService } from './shared-store.service';
import { Observable } from 'rxjs';
import { Alert } from '../interfaces/general';
import { take } from 'rxjs/operators';
import { LoadingController } from '@ionic/angular';
import { SharedService } from './shared.service';

@Injectable({
  providedIn: 'root'
})
export class AlertsService {

  addAsAppAlertLock = false;

  constructor(private sharedStoreService: SharedStoreService,
    private loadingCtrl: LoadingController,
    private sharedService: SharedService) { }

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

  sendAddAsAppAlert() {
    if (this.addAsAppAlertLock) return;
    this.addAsAppAlertLock = true;
    try {
      const val = localStorage.getItem('add_as_app');
      if (val && val === 'false') {
        this.sharedStoreService.installAsAppStateSubject.next({isInstalled: false, canInstall: true, canShowInMenu: true});
        return;
      } else {
        this.sharedStoreService.installAsAppStateSubject.next({isInstalled: false, canInstall: true, canShowInMenu: false});
      }
    } catch (error) {
      console.error(error);
    }
    const alert: Alert = {
      id: this.sharedStoreService.createId(),
      title: 'Oozdr - Get the app',
      content: 'Install instantly, find what you need faster, anytime.',
      dismissText: 'Not now',
      okText: 'Install',
      action: {
        actionName: 'add_as_app',
        isAction: true,
        delay: 800
      }
    }
    this.addAlert(alert);
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
    if (alert.action.actionName === 'add_as_app') {
      try {
        localStorage.setItem('add_as_app', 'false');
        this.sharedStoreService.installAsAppStateSubject.next({isInstalled: false, canInstall: true, canShowInMenu: true});
      } catch (error) {
        console.error(error);
      }
    }
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
      } else if (alert.action.actionName === 'add_as_app') {
        this.sharedService.promptForPwaInstallation();
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
