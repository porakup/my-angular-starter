import { ModalService } from './modal.service';
import { ModalData } from '../../models/modal-data.model';
import { ClearModalAction, SetModalAction } from '../../store/app/app.actions';
import { GetModal } from '../../store/app/app.getters';
import { StoreService } from '../store/store.service';

describe('ModalService', () => {
  let service: ModalService;
  let storeService: StoreService;
  const mockModalData: ModalData = { title: 'Test Title', content: 'Test Content', isOpen: false };

  beforeEach(() => {
    storeService = {
      asyncDispatch: jest.fn(),
    } as Partial<StoreService> as StoreService;

    service = new ModalService(storeService);
  });

  describe('openModal', () => {
    it('should dispatch SetModalAction with isOpen set to true and select GetModal', async () => {
      await service.openModal(mockModalData);
      const expectedModalData = { ...mockModalData, isOpen: true };
      expect(storeService.asyncDispatch).toHaveBeenCalledWith(SetModalAction({ modal: expectedModalData }), GetModal);
    });

    it('should not modify the original modalData object', async () => {
      const originalIsOpen = mockModalData.isOpen;
      await service.openModal(mockModalData);
      expect(mockModalData.isOpen).toBe(originalIsOpen);
    });
  });

  describe('closeModal', () => {
    it('should dispatch ClearModalAction and select GetModal', async () => {
      await service.closeModal();
      expect(storeService.asyncDispatch).toHaveBeenCalledWith(ClearModalAction(), GetModal);
    });
  });
});
