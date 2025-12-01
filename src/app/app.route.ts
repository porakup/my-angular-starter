import { Routes } from '@angular/router';
import { RouteGuard } from '../router/route.guard';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('../router/main.route').then((r) => r.MainRoute),
    canActivate: [RouteGuard],
  },
  {
    path: 'login',
    loadComponent: () => import('../pages/login/login.page').then((p) => p.LoginPage),
  },
  {
    path: '404',
    loadComponent: () => import('../pages/error/error.page').then((p) => p.ErrorPage),
    canActivate: [RouteGuard],
  },
  { path: '**', redirectTo: '/404' },
];
