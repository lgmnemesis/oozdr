import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { SharedStoreService } from '../services/shared-store.service';

@Injectable({
  providedIn: 'root'
})
export class NoGuard implements CanActivate {

  constructor(private sharedStoreService: SharedStoreService) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
    this.sharedStoreService.loadingAppSubject.next(false);
    return true;
  }
}
