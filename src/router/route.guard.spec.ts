import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Store } from '@ngrx/store';
import { GetisLoggedIn } from '../store/auth/auth.getters';
import { RouteGuard } from './route.guard';
import { of } from 'rxjs';

describe('RouteGuard', () => {
  let guard: RouteGuard;
  let router: Router;
  let store: Store;

  beforeEach(() => {
    router = {
      navigateByUrl: jest.fn().mockResolvedValue(true),
    } as Partial<Router> as Router;

    store = {
      select: jest.fn(),
    } as Partial<Store> as Store;

    guard = new RouteGuard(router, store);
  });

  describe('canActivate', () => {
    let route: ActivatedRouteSnapshot;
    let state: RouterStateSnapshot;

    beforeEach(() => {
      route = {} as ActivatedRouteSnapshot;
      state = { url: '/' } as RouterStateSnapshot;
      (store.select as jest.Mock).mockReturnValue(of(false));
    });

    it('should return true and not navigate if logged in and not on /login', async () => {
      (store.select as jest.Mock).mockReturnValue(of(true));
      state.url = '/product';
      const canActivateResult = await guard.canActivate(route, state);
      expect(canActivateResult).toBe(true);
      expect(router.navigateByUrl).not.toHaveBeenCalled();
    });

    it('should navigate to / and return false if logged in and on /login', async () => {
      (store.select as jest.Mock).mockReturnValue(of(true));
      state.url = '/login';
      const canActivateResult = await guard.canActivate(route, state);
      expect(canActivateResult).toBe(false);
      expect(router.navigateByUrl).toHaveBeenCalledWith('/');
    });

    it('should navigate to /login and return false if not logged in and not on /login', async () => {
      (store.select as jest.Mock).mockReturnValue(of(false));
      state.url = '/product';
      const canActivateResult = await guard.canActivate(route, state);
      expect(canActivateResult).toBe(false);
      expect(router.navigateByUrl).toHaveBeenCalledWith('login');
    });

    it('should return true and not navigate if not logged in and on /login', async () => {
      (store.select as jest.Mock).mockReturnValue(of(false));
      state.url = '/login';
      const canActivateResult = await guard.canActivate(route, state);
      expect(canActivateResult).toBe(true);
      expect(router.navigateByUrl).not.toHaveBeenCalled();
    });

    it('should call select with GetisLoggedIn', async () => {
      await guard.canActivate(route, state);
      expect(store.select).toHaveBeenCalledWith(GetisLoggedIn);
    });
  });
});
