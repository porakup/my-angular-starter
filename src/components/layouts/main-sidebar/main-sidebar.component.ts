import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { ModalData } from '../../../models/modal-data.model';
import { AuthService } from '../../../services/auth/auth.service';
import { ModalService } from '../../../services/modal/modal.service';
import { ProductService } from '../../../services/product/product.service';
import { I18NPipe } from '../../../utils/pipes/i18n/i18n.pipe';

@Component({
  selector: 'main-sidebar',
  templateUrl: './main-sidebar.component.html',
  standalone: true,
  imports: [CommonModule, I18NPipe],
})
export class MainSidebarComponent implements OnInit {
  constructor(private router: Router, private modalService: ModalService, private authService: AuthService, private productService: ProductService) {}

  activeRoute: string = '';

  ngOnInit(): void {
    this.activeRoute = this.router.url;
    this.router.events.pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd)).subscribe((event) => {
      this.activeRoute = event.urlAfterRedirects;
    });
  }

  goToProductList(): void {
    this.router.navigateByUrl('product');
  }

  async openModal(): Promise<void> {
    const title = 'Example Modal Title';
    const content = 'Example Modal Content.';
    const modalData: ModalData = {
      title,
      content,
    };
    await this.modalService.openModal(modalData);
  }

  async callApi(): Promise<void> {
    await this.productService.testCallApi();
  }

  async logout(): Promise<void> {
    await this.authService.logout();
  }
}
