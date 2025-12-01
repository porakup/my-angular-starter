import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { firstValueFrom } from 'rxjs';
import { ProductData } from '../../models/product-data.model';
import { SKIP_BASE_API, SKIP_LOADER } from '../../app/api-context.tokens';

@Injectable({ providedIn: 'root' })
export class ProductService {
  constructor(private http: HttpClient, private store: Store) {}

  private productList: ProductData[] = [
    {
      productCode: 'P0001',
      productName: 'Product 01',
      price: '1,000.00',
      createdBy: 'Admin',
      createdDate: '05/05/2025 10:30',
    },
    {
      productCode: 'P0002',
      productName: 'Product 02',
      price: '1,000.00',
      createdBy: 'Admin',
      createdDate: '05/05/2025 10:30',
    },
    {
      productCode: 'P0003',
      productName: 'Product 03',
      price: '1,000.00',
      createdBy: 'Admin',
      createdDate: '05/05/2025 10:30',
    },
    {
      productCode: 'P0004',
      productName: 'Product 04',
      price: '1,000.00',
      createdBy: 'Admin',
      createdDate: '05/05/2025 10:30',
    },
    {
      productCode: 'P0005',
      productName: 'Product 05',
      price: '1,000.00',
      createdBy: 'Admin',
      createdDate: '05/05/2025 10:30',
    },
  ];

  async getProductList(): Promise<ProductData[]> {
    return this.productList;
  }

  async getProductDetail(productCode: string): Promise<ProductData | undefined> {
    const product: ProductData | undefined = this.productList.find((p: ProductData) => p.productCode === productCode);
    return product;
  }

  async testCallApi(): Promise<any> {
    const context = new HttpContext().set(SKIP_BASE_API, true).set(SKIP_LOADER, false);
    const resp = await firstValueFrom(this.http.get<any>('https://localhost:8080/api/v0', { context }));
    return resp;
  }
}
