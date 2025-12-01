import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../services/product/product.service';
import { ProductDetailPage } from './product-detail.page';
import { ProductData } from '../../models/product-data.model';

describe('ProductDetailPage', () => {
  let component: ProductDetailPage;
  let router: Router;
  let route: ActivatedRoute;
  let productService: ProductService;

  const mockProduct: ProductData = {
    productCode: 'P0001',
    productName: 'Product 01',
    price: '1,000.00',
    createdBy: 'Admin',
    createdDate: '05/05/2025 10:30',
  };

  beforeEach(() => {
    router = {
      navigateByUrl: jest.fn().mockResolvedValue(true),
    } as Partial<Router> as Router;

    route = {
      snapshot: {
        url: [],
        params: {},
        queryParams: {},
        fragment: null,
        data: {},
        outlet: 'primary',
        component: null,
        title: null,
        queryParamMap: {
          get: jest.fn((key: string): string | null => null),
          has: jest.fn((key: string): boolean => false),
          keys: [],
        },
        paramMap: {
          get: jest.fn((key: string): string | null => (key === 'productCode' ? 'P0001' : null)),
          has: jest.fn((key: string): boolean => key === 'productCode'),
          keys: [],
        },
        routeConfig: null,
        root: {} as any,
        parent: null,
        firstChild: null,
        children: [],
        pathFromRoot: [],
        resolve: {},
      },
    } as Partial<any> as ActivatedRoute;

    productService = {
      getProductDetail: jest.fn().mockResolvedValue(mockProduct),
    } as Partial<ProductService> as ProductService;

    component = new ProductDetailPage(router, route, productService);
  });

  it('should initialize productCode from route params in constructor', () => {
    expect(component.productCode).toBe('P0001');
  });

  it('should initialize productData to an empty object in constructor', () => {
    expect(component.productData).toEqual({
      productCode: '',
      productName: '',
      price: '',
      createdBy: '',
      createdDate: '',
    });
  });

  describe('ngOnInit', () => {
    it('should call getproductDetail with productCode if productCode exists', async () => {
      await component.ngOnInit();
      expect(productService.getProductDetail).toHaveBeenCalledWith('P0001');
      expect(component.productData).toEqual(mockProduct);
    });

    it('should call back() if productCode is undefined', async () => {
      const mockRoute = {
        snapshot: {
          url: [],
          params: {},
          queryParams: {},
          fragment: null,
          data: {},
          outlet: 'primary',
          component: null,
          title: null,
          queryParamMap: {
            get: jest.fn((key: string): string | null => null),
            has: jest.fn((key: string): boolean => false),
            keys: [],
          },
          paramMap: {
            get: jest.fn((key: string): string | null => null),
            has: jest.fn((key: string): boolean => false),
            keys: [],
          },
          routeConfig: null,
          root: {} as any,
          parent: null,
          firstChild: null,
          children: [],
          pathFromRoot: [],
          resolve: {},
        },
      } as Partial<any> as ActivatedRoute;

      const component = new ProductDetailPage(router, mockRoute, productService);
      const backSpy = jest.spyOn(component, 'back');
      await component.ngOnInit();
      expect(backSpy).toHaveBeenCalled();
      expect(productService.getProductDetail).not.toHaveBeenCalled();
    });
  });

  describe('save', () => {
    it('should navigate to "product"', () => {
      component.save();
      expect(router.navigateByUrl).toHaveBeenCalledWith('product');
    });
  });

  describe('back', () => {
    it('should navigate to "product"', () => {
      component.back();
      expect(router.navigateByUrl).toHaveBeenCalledWith('product');
    });
  });
});
