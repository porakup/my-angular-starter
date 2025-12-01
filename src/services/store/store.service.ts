import { Injectable } from '@angular/core';
import { Action, MemoizedSelector, Store } from '@ngrx/store';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class StoreService {
  constructor(private store: Store) {}

  async asyncDispatch<model, type = model>(action: Action, getter: MemoizedSelector<object, type, (s1: model) => type>): Promise<void> {
    this.store.dispatch(action);
    await firstValueFrom(this.store.select(getter));
  }
}
