import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { of, throwError } from 'rxjs';
import { ProductService } from './product.service';
import { GetRequest } from '../../store/app/app.getters';
import { ProductData } from '../../models/product-data.model';
import { SKIP_BASE_API, SKIP_LOADER } from '../../app/api-context.tokens';

describe('ProductService', () => {
  let service: ProductService;
  let http: HttpClient;
  let store: Store;

  const mockProductList: ProductData[] = [
    { productCode: 'P0001', productName: 'Product 01', price: '1,000.00', createdBy: 'Admin', createdDate: '05/05/2025 10:30' },
    { productCode: 'P0002', productName: 'Product 02', price: '1,000.00', createdBy: 'Admin', createdDate: '05/05/2025 10:30' },
    { productCode: 'P0003', productName: 'Product 03', price: '1,000.00', createdBy: 'Admin', createdDate: '05/05/2025 10:30' },
    { productCode: 'P0004', productName: 'Product 04', price: '1,000.00', createdBy: 'Admin', createdDate: '05/05/2025 10:30' },
    { productCode: 'P0005', productName: 'Product 05', price: '1,000.00', createdBy: 'Admin', createdDate: '05/05/2025 10:30' },
  ];

  beforeEach(() => {
    http = {
      get: jest.fn().mockReturnValue(of({ items: [] })),
    } as Partial<HttpClient> as HttpClient;

    store = {
      dispatch: jest.fn(),
      select: jest.fn((selector) => {
        if (selector === GetRequest) return of(0);
        return of(null);
      }),
    } as Partial<Store> as Store;

    service = new ProductService(http, store);
  });

  describe('getProductList', () => {
    it('should return the predefined product list', async () => {

      const productList = await service.getProductList();

      expect(productList).toEqual(mockProductList);
    });
  });

  describe('getProductDetail', () => {
    it('should return the correct product detail for a given product code', async () => {
      const productCode = 'P0003';

      const productDetail = await service.getProductDetail(productCode);

      expect(productDetail).toEqual(mockProductList.find((p) => p.productCode === productCode));
    });

    it('should return undefined if no product matches the given product code', async () => {
      const productCode = 'P9999';

      const productDetail = await service.getProductDetail(productCode);

      expect(productDetail).toBeUndefined();
    });
  });

  describe('testCallApi', () => {
    it('should call api with skip base api and open loader', async () => {
      const mockResponse = { items: [{ id: '1', title: 'Test' }] };
      (http.get as jest.Mock).mockReturnValue(of(mockResponse));

      const resp = await service.testCallApi();
      const [url, options] = (http.get as jest.Mock).mock.calls[0];

      expect(url).toBe('https://localhost:8080/api/v0');
      expect(options.context?.get(SKIP_BASE_API)).toBe(true);
      expect(options.context?.get(SKIP_LOADER)).toBe(false);
      expect(resp).toEqual(mockResponse);
    });

    it('should handle call api error and open loader', async () => {
      const mockError = new Error('API error');
      (http.get as jest.Mock).mockReturnValue(throwError(() => mockError));

      await expect(service.testCallApi()).rejects.toThrow(mockError);
      const [url, options] = (http.get as jest.Mock).mock.calls[0];

      expect(url).toBe('https://localhost:8080/api/v0');
      expect(options.context?.get(SKIP_BASE_API)).toBe(true);
      expect(options.context?.get(SKIP_LOADER)).toBe(false);
    });
  });
});
