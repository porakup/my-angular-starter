import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { I18NPipe } from '../../utils/pipes/i18n/i18n.pipe';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product/product.service';
import { ProductData } from '../../models/product-data.model';

@Component({
  selector: 'product-detail-page',
  templateUrl: './product-detail.page.html',
  standalone: true,
  imports: [I18NPipe, CommonModule, FormsModule],
})
export class ProductDetailPage implements OnInit {
  constructor(private router: Router, private route: ActivatedRoute, private productService: ProductService) {
    this.productCode = this.route.snapshot.paramMap.get('productCode')!;
  }

  productCode: string | undefined = '';
  productData: ProductData | undefined = {
    productCode: '',
    productName: '',
    price: '',
    createdBy: '',
    createdDate: '',
  };

  async ngOnInit(): Promise<void> {
    if (this.productCode) {
      this.productData = await this.productService.getProductDetail(this.productCode);
    } else {
      this.back();
    }
  }

  save(): void {
    this.router.navigateByUrl('product');
  }

  back(): void {
    this.router.navigateByUrl('product');
  }
}
