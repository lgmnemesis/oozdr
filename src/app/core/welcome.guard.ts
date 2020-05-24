import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { SharedStoreService } from '../services/shared-store.service';

@Injectable({
  providedIn: 'root'
})
export class WelcomeGuard implements CanActivate {

  constructor(private sharedStoreService: SharedStoreService,
    private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      
    const canEnter = this.sharedStoreService.canEnterWelcome;
    const isModalOpen = this.sharedStoreService.isModalOpen;
    if (canEnter) {
      console.log('can enter');
      if (isModalOpen) {
        console.log('is open:', isModalOpen);
        this.sharedStoreService.isModalOpen = false;
        return false;
      }
      return true;
    }
    this.router.navigate(['/']).catch((error => console.error(error)));
    return false;
  }
  
}
