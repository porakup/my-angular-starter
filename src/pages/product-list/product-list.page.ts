import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { I18NPipe } from '../../utils/pipes/i18n/i18n.pipe';
import { ProductData } from '../../models/product-data.model';
import { ProductService } from '../../services/product/product.service';

@Component({
  selector: 'product-list-page',
  templateUrl: './product-list.page.html',
  standalone: true,
  imports: [I18NPipe, CommonModule],
})
export class ProductListPage implements OnInit {
  constructor(private router: Router, private productService: ProductService) {}

  productList: Array<ProductData> = [];

  async ngOnInit(): Promise<void> {
    this.productList = await this.productService.getProductList();
  }

  gotoView(productCode: string) {
    this.router.navigate(['/product/detail', productCode]);
  }

  gotoEdit(productCode: string) {
    this.router.navigate(['/product/detail', productCode]);
  }
}
