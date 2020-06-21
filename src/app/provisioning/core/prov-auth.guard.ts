import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ProvAuthService } from '../services/prov-auth.service';

@Injectable({
  providedIn: 'root'
})
export class ProvAuthGuard implements CanActivate {

  constructor(private router: Router,
    private provAuthService: ProvAuthService) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
    return this.canEnter();
  }

  async canEnter() {
    try {
      const user = await this.provAuthService.getUser();
      if (user) return true;
    } catch (error) {
      console.error(error);
    }
    this.router.navigate(['/prov-signin']).catch((error => console.error(error)));
    return false;
  }
}
