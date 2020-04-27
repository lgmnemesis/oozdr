import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { SharedService } from '../services/shared.service';

@Injectable({
  providedIn: 'root'
})
export class ConnectionsGuard implements CanActivate {

  constructor(private sharedService: SharedService,
    private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      
    const canEnter = this.sharedService.canEnterHome;
    if (canEnter) {
      return true;
    }
    this.router.navigate(['/']);
    return false;
  }
  
}
