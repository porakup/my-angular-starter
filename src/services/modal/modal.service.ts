import { Injectable } from '@angular/core';
import { ModalData } from '../../models/modal-data.model';
import { ClearModalAction, SetModalAction } from '../../store/app/app.actions';
import { GetModal } from '../../store/app/app.getters';
import { AppState } from '../../store/app/app.state';
import { StoreService } from '../store/store.service';

@Injectable({ providedIn: 'root' })
export class ModalService {
  constructor(private storeService: StoreService) {}

  async openModal(modalData: ModalData): Promise<void> {
    modalData.isOpen = true;
    await this.storeService.asyncDispatch<AppState, ModalData>(SetModalAction({ modal: modalData }), GetModal);
  }

  async closeModal(): Promise<void> {
    await this.storeService.asyncDispatch<AppState, ModalData>(ClearModalAction(), GetModal);
  }
}
