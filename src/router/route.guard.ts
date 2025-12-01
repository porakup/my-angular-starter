import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, GuardResult, Router, RouterStateSnapshot } from '@angular/router';
import { Store } from '@ngrx/store';
import { firstValueFrom } from 'rxjs';
import { GetisLoggedIn } from '../store/auth/auth.getters';

@Injectable({
  providedIn: 'root',
})
export class RouteGuard implements CanActivate {
  constructor(private router: Router, private store: Store) {}

  isLoggedIn: boolean = false;

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<GuardResult> {
    const path = state.url;

    this.isLoggedIn = await firstValueFrom(this.store.select(GetisLoggedIn));

    if (this.isLoggedIn) {
      if (path === '/login') {
        this.router.navigateByUrl('/');
        return false;
      } else {
        return true;
      }
    }

    if (path !== '/login') {
      this.router.navigateByUrl('login');
      return false;
    } else {
      return true;
    }
  }
}
