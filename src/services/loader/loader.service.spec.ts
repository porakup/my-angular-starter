import { LoaderService } from './loader.service';
import { AddRequestAction, RequestDoneAction } from '../../store/app/app.actions';
import { GetRequest } from '../../store/app/app.getters';
import { StoreService } from '../store/store.service';

describe('LoaderService', () => {
  let service: LoaderService;
  let storeService: StoreService;

  beforeEach(() => {
    storeService = {
      asyncDispatch: jest.fn(),
    } as Partial<StoreService> as StoreService;

    service = new LoaderService(storeService);
  });

  describe('openLoader', () => {
    it('should dispatch AddRequestAction and select GetRequest', async () => {
      await service.openLoader();
      expect(storeService.asyncDispatch).toHaveBeenCalledWith(AddRequestAction(), GetRequest);
    });
  });

  describe('closeLoader', () => {
    it('should dispatch RequestDoneAction and select GetRequest', async () => {
      await service.closeLoader();
      expect(storeService.asyncDispatch).toHaveBeenCalledWith(RequestDoneAction(), GetRequest);
    });
  });
});
