import { Router, NavigationEnd } from '@angular/router';
import { ModalService } from '../../../services/modal/modal.service';
import { AuthService } from '../../../services/auth/auth.service';
import { ProductService } from '../../../services/product/product.service';
import { MainSidebarComponent } from './main-sidebar.component';
import { Subject } from 'rxjs';

describe('MainSidebarComponent', () => {
  let component: MainSidebarComponent;
  let router: Router;
  let modalService: ModalService;
  let authService: AuthService;
  let productService: ProductService;
  let routerEventsSubject: Subject<NavigationEnd>;

  beforeEach(() => {
    routerEventsSubject = new Subject<NavigationEnd>();

    router = {
      url: '/',
      navigateByUrl: jest.fn(),
      events: routerEventsSubject.asObservable(),
    } as Partial<Router> as Router;

    modalService = {
      openModal: jest.fn().mockResolvedValue(undefined),
    } as Partial<ModalService> as ModalService;

    authService = {
      logout: jest.fn().mockResolvedValue(undefined),
    } as Partial<AuthService> as AuthService;

    productService = {
      testCallApi: jest.fn().mockResolvedValue(undefined),
    } as Partial<ProductService> as ProductService;

    component = new MainSidebarComponent(router, modalService, authService, productService);
  });

  it('should initialize activeRoute with the current router url', () => {
    component.ngOnInit();
    expect(component.activeRoute).toBe('/');
  });

  it('should update activeRoute on NavigationEnd events', () => {
    component.ngOnInit();
    routerEventsSubject.next(new NavigationEnd(1, '/', '/product'));
    expect(component.activeRoute).toBe('/product');
  });

  it('goToProductList should navigate to "product"', () => {
    component.goToProductList();
    expect(router.navigateByUrl).toHaveBeenCalledWith('product');
  });

  it('openModal should call openModal with correct data', async () => {
    await component.openModal();
    expect(modalService.openModal).toHaveBeenCalledWith({
      title: 'Example Modal Title',
      content: 'Example Modal Content.',
    });
  });

  it('callApi should call testCallApi', async () => {
    await component.callApi();
    expect(productService.testCallApi).toHaveBeenCalled();
  });

  it('logout should call logout', async () => {
    await component.logout();
    expect(authService.logout).toHaveBeenCalled();
  });
});
