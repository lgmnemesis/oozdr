import { Injectable } from '@angular/core';
import { SharedStoreService } from './shared-store.service';
import { Observable } from 'rxjs';
import { Alert, FcmMessage } from '../interfaces/general';
import { take } from 'rxjs/operators';
import { LoadingController } from '@ionic/angular';
import { SharedService } from './shared.service';
import { IonToastMessage } from '../interfaces/toast-message';
import { AnalyticsService } from './analytics.service';
import { LocaleService } from './locale.service';

@Injectable({
  providedIn: 'root'
})
export class AlertsService {

  addAsAppAlertLock = false;
  deferredPrompt: any;
  dictionary = this.localeService.dictionary;
  dictAlertService = this.dictionary.alertsService;

  constructor(private sharedStoreService: SharedStoreService,
    private loadingCtrl: LoadingController,
    private sharedService: SharedService,
    private analyticsService: AnalyticsService,
    private localeService: LocaleService) { }

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
      title: this.dictAlertService.addAsAppAlert.title,
      content: this.dictAlertService.addAsAppAlert.content,
      dismissText: this.dictAlertService.addAsAppAlert.dismissText,
      okText: this.dictAlertService.addAsAppAlert.okText,
      color: 'success',
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
      title: this.dictAlertService.newVersionAlert.title,
      content: this.dictAlertService.newVersionAlert.content,
      dismissText: this.dictAlertService.newVersionAlert.dismissText,
      okText: this.dictAlertService.newVersionAlert.okText,
      color: 'primary',
      action: {
        actionName: 'new_version',
        isAction: true,
        delay: 800
      }
    }
    this.addAlert(alert);
  }

  sendFcmMessage(fcmMessage: FcmMessage) {
    const alert: Alert = {
      id: this.sharedStoreService.createId(),
      title: fcmMessage.title,
      content: fcmMessage.content,
      dismissText: this.dictAlertService.FcmMessage.dismissText,
      okText: this.dictAlertService.FcmMessage.okText,
      color: 'success',
      action: {
        actionName: 'fcm',
        isAction: false,
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
        this.promptForPwaInstallation();
      }
    }
    this.removeAlert(alert);
  }

  async presentReloadingVersion() {
    const loading = await this.loadingCtrl.create({
      message: this.dictAlertService.reloadingVersionMessage,
      duration: 7000,
      mode: 'ios'
    });
    await loading.present();

    const { role, data } = await loading.onDidDismiss();
  }

  promptForPwaInstallation() {
    if (this.deferredPrompt) {
      this.deferredPrompt.prompt();
      // Wait for the user to respond to the prompt
      this.deferredPrompt.userChoice
      .then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          this.pwaAppInstalled();
          this.analyticsService.addAsAppAcceptedEvent();
        } else {
          this.analyticsService.addAsAppDismissedEvent();
        }
        this.deferredPrompt = null;
      });
    }
  }

  pwaAppInstalled() {
    this.addAsAppAlertLock = true;
    this.removeAllAddAsAppAlerts();
    this.sharedStoreService.installAsAppStateSubject.next({isInstalled: true, canInstall: false, canShowInMenu: false});
    const message: IonToastMessage = {
      message: this.dictAlertService.pwaAppInstalled,
    }
    setTimeout(() => {
      this.sharedService.presentToast(message);
    }, 1000);
    this.analyticsService.installedAsAppEvent();
  }

  async removeAllAddAsAppAlerts() {
    const alerts = await this.getAlerts();
    if (!alerts) return;
    alerts.forEach(alert => {
      if (alert.action.actionName === 'add_as_app') {
        this.removeAlert(alert);
      }
    });
  }
}
