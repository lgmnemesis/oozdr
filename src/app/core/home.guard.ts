import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { SharedStoreService } from '../services/shared-store.service';
import { NavController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class HomeGuard implements CanActivate {

  constructor(private sharedStoreService: SharedStoreService,
    private navCtrl: NavController) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      
    const canEnter = this.sharedStoreService.canEnterHome;
    const isModalOpen = this.sharedStoreService.isModalOpen;
    if (isModalOpen) {
      this.sharedStoreService.isModalOpen = false;
      return false;
    }
    if (canEnter) {
      this.navCtrl.navigateRoot('/connections');
      return false;
    }
    return true;
  }
  
}
