import { Injectable } from '@angular/core';
import { AddRequestAction, RequestDoneAction } from '../../store/app/app.actions';
import { GetRequest } from '../../store/app/app.getters';
import { AppState } from '../../store/app/app.state';
import { StoreService } from '../store/store.service';

@Injectable({ providedIn: 'root' })
export class LoaderService {
  constructor(private storeService: StoreService) {}

  async openLoader(): Promise<void> {
    await this.storeService.asyncDispatch<AppState, number>(AddRequestAction(), GetRequest);
  }

  async closeLoader(): Promise<void> {
    await this.storeService.asyncDispatch<AppState, number>(RequestDoneAction(), GetRequest);
  }
}
