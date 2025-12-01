import { Routes } from '@angular/router';
import { MainPage } from '../pages/main/main.page';

export const MainRoute: Routes = [
  {
    path: '',
    component: MainPage,
    children: [
      { path: '', redirectTo: 'product', pathMatch: 'full' },
      {
        path: 'product',
        loadComponent: () => import('../pages/product-list/product-list.page').then((p) => p.ProductListPage),
      },
      {
        path: 'product/detail/:productCode',
        loadComponent: () => import('../pages/product-detail/product-detail.page').then((p) => p.ProductDetailPage),
      },
    ],
  },
];
