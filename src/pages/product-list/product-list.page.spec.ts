import { Router } from '@angular/router';
import { ProductData } from '../../models/product-data.model';
import { ProductService } from '../../services/product/product.service';
import { ProductListPage } from './product-list.page';

describe('ProductListPage', () => {
  let component: ProductListPage;
  let router: Router;
  let productService: ProductService;

  const mockProductList: ProductData[] = [
    { productCode: 'P0001', productName: 'Product 01', price: '1,000.00', createdBy: 'Admin', createdDate: '05/05/2025 10:30' },
    { productCode: 'P0002', productName: 'Product 02', price: '1,000.00', createdBy: 'Admin', createdDate: '05/05/2025 10:30' },
  ];

  beforeEach(() => {
    router = {
      navigate: jest.fn().mockResolvedValue(true),
    } as Partial<Router> as Router;

    productService = {
      getProductList: jest.fn().mockResolvedValue(mockProductList),
    } as Partial<ProductService> as ProductService;

    component = new ProductListPage(router, productService);
  });

  it('should initialize productList on ngOnInit', async () => {
    await component.ngOnInit();
    expect(productService.getProductList).toHaveBeenCalled();
    expect(component.productList).toEqual(mockProductList);
  });

  describe('gotoView', () => {
    it('should navigate to /product/detail/:productCode', () => {
      const productCode = 'P0001';
      component.gotoView(productCode);
      expect(router.navigate).toHaveBeenCalledWith(['/product/detail', productCode]);
    });
  });

  describe('gotoEdit', () => {
    it('should navigate to /product/detail/:productCode', () => {
      const productCode = 'P0002';
      component.gotoEdit(productCode);
      expect(router.navigate).toHaveBeenCalledWith(['/product/detail', productCode]);
    });
  });
});
