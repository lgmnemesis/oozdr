import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { SharedStatesService } from '../services/shared-states.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private sharedStatesService: SharedStatesService,
    private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
    const canEnter = this.sharedStatesService.canEnterHome;
    if (canEnter) {
      return true;
    }
    this.router.navigate(['/']).catch((error => console.error(error)));
    return false;
  }
}
