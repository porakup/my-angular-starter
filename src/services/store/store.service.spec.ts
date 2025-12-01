import { Action, MemoizedSelector, Store } from '@ngrx/store';
import { StoreService } from './store.service';
import { of } from 'rxjs';

describe('StoreService', () => {
  let service: StoreService;
  let store: jest.Mocked<Store>;

  beforeEach(() => {
    store = {
      dispatch: jest.fn(),
      select: jest.fn(),
    } as unknown as jest.Mocked<Store>;

    service = new StoreService(store);
  });

  describe('asyncDispatch', () => {
    it('should dispatch action and wait for selector', async () => {
      const action: Action = { type: '[TestAction] Test' };
      const selector = {} as MemoizedSelector<object, string, (s1: any) => string>;
      const expectedResult = 'test';

      store.select.mockReturnValue(of(expectedResult));

      await service.asyncDispatch(action, selector);

      expect(store.dispatch).toHaveBeenCalledWith(action);
      expect(store.select).toHaveBeenCalledWith(selector);
    });
  });
});
