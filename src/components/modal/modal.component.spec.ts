import { ModalComponent } from './modal.component';
import { ModalService } from '../../services/modal/modal.service';

describe('ModalComponent', () => {
  let component: ModalComponent;
  let modalService: ModalService;

  beforeEach(() => {
    modalService = {
      closeModal: jest.fn().mockResolvedValue(undefined),
    } as Partial<ModalService> as ModalService;

    component = new ModalComponent(modalService);
    component.data = { title: 'Test Title', content: 'Test Content' };
  });

  it('should initialize data input', () => {
    expect(component.data.title).toBe('Test Title');
    expect(component.data.content).toBe('Test Content');
    expect(component.data.yesFunc).toBe(undefined);
    expect(component.data.noFunc).toBe(undefined);
  });

  it('yesAction should call yesFunc if defined and then closeModal', async () => {
    const mockYesFunc = jest.fn().mockResolvedValue('yes');
    component.data.yesFunc = mockYesFunc;
    await component.yesAction();
    expect(mockYesFunc).toHaveBeenCalledTimes(1);
    expect(modalService.closeModal).toHaveBeenCalledTimes(1);
  });

  it('yesAction should call closeModal even if data.yesFunc is not defined', async () => {
    component.data.yesFunc = undefined;
    await component.yesAction();
    expect(modalService.closeModal).toHaveBeenCalledTimes(1);
  });

  it('noAction should call noFunc if defined and then closeModal', async () => {
    const mockNoFunc = jest.fn().mockResolvedValue('no');
    component.data.noFunc = mockNoFunc;
    await component.noAction();
    expect(mockNoFunc).toHaveBeenCalledTimes(1);
    expect(modalService.closeModal).toHaveBeenCalledTimes(1);
  });

  it('noAction should call closeModal even if noFunc is not defined', async () => {
    component.data.noFunc = undefined;
    await component.noAction();
    expect(modalService.closeModal).toHaveBeenCalledTimes(1);
  });
});
