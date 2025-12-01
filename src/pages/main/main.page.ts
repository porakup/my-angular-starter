import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { MainFooterComponent } from '../../components/layouts/main-footer/main-footer.component';
import { MainHeaderComponent } from '../../components/layouts/main-header/main-header.component';
import { MainSidebarComponent } from '../../components/layouts/main-sidebar/main-sidebar.component';
import { LoaderComponent } from '../../components/loader/loader.component';
import { ModalComponent } from '../../components/modal/modal.component';
import { ModalData } from '../../models/modal-data.model';
import { GetModal, GetOpenModal, GetRequest } from '../../store/app/app.getters';

@Component({
  selector: 'main-page',
  templateUrl: './main.page.html',
  standalone: true,
  imports: [MainHeaderComponent, MainSidebarComponent, MainFooterComponent, RouterOutlet, LoaderComponent, CommonModule, ModalComponent],
})
export class MainPage implements OnInit, OnDestroy {
  constructor(private store: Store) {}

  openLoaderSubscribe: Subscription | undefined;
  openModalSubscribe: Subscription | undefined;
  modalDataSubscribe: Subscription | undefined;
  html: Element | undefined;
  isLoad: boolean = false;
  openModal: boolean = false;
  modalData: ModalData = {
    title: '',
    content: '',
    yesFunc: undefined,
    noFunc: undefined,
    isOpen: false,
  };

  ngOnInit(): void {
    this.html = document.getElementsByTagName('HTML')[0];

    this.openLoaderSubscribe = this.store.select(GetRequest).subscribe((request) => {
      if (request! > 0) {
        if (!this.isLoad) {
          this.isLoad = true;
          this.html!.setAttribute('style', 'overflow-y: hidden;');
        }
      } else if (this.isLoad) {
        this.isLoad = false;
        this.html!.setAttribute('style', 'overflow-y: scroll;');
      }
    });

    this.openModalSubscribe = this.store.select(GetOpenModal).subscribe((open) => {
      if (open) {
        if (!this.openModal) {
          this.openModal = true;
          this.html!.setAttribute('style', 'overflow-y: hidden;');
        }
      } else if (this.openModal) {
        this.openModal = false;
        this.html!.setAttribute('style', 'overflow-y: scroll;');
      }
    });

    this.modalDataSubscribe = this.store.select(GetModal).subscribe((data) => {
      this.modalData = data;
    });
  }

  ngOnDestroy(): void {
    if (this.openLoaderSubscribe) this.openLoaderSubscribe.unsubscribe();
    if (this.openModalSubscribe) this.openModalSubscribe.unsubscribe();
    if (this.modalDataSubscribe) this.modalDataSubscribe.unsubscribe();
  }
}
