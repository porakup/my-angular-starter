import { Store } from '@ngrx/store';
import { of, Subject, Subscription } from 'rxjs';
import { ModalData } from '../../models/modal-data.model';
import { GetModal, GetOpenModal, GetRequest } from '../../store/app/app.getters';
import { MainPage } from './main.page';

describe('MainPage', () => {
  let component: MainPage;
  let store: Store;
  let htmlElement: { setAttribute: jest.Mock } | null | Element;

  beforeEach(() => {
    htmlElement = { setAttribute: jest.fn() };
    document.getElementsByTagName = jest.fn(() => [htmlElement]) as jest.Mock;

    store = {
      select: jest.fn((selector) => {
        if (selector === GetRequest) return of(0);
        if (selector === GetOpenModal) return of(false);
        if (selector === GetModal) return of({ title: '', content: '', isOpen: false });
        return of(null);
      }),
    } as Partial<Store> as Store;

    component = new MainPage(store);
  });

  it('should get the HTML element on ngOnInit', () => {
    component.ngOnInit();
    expect(document.getElementsByTagName).toHaveBeenCalledWith('HTML');
    expect(component.html).toBe(htmlElement as Element);
  });

  describe('loader subscription', () => {
    it('should set overflow-y: hidden if request count > 0 and isLoad is false', () => {
      (store.select as jest.Mock).mockReturnValueOnce(of(1));
      component.isLoad = false;
      component.ngOnInit();
      expect(htmlElement!.setAttribute).toHaveBeenCalledWith('style', 'overflow-y: hidden;');
      expect(component.isLoad).toBe(true);
    });

    it('should not set overflow-y if request count > 0 and isLoad is true', () => {
      (store.select as jest.Mock).mockReturnValueOnce(of(1));
      component.isLoad = true;
      component.ngOnInit();
      expect(htmlElement!.setAttribute).not.toHaveBeenCalledWith('style', 'overflow-y: hidden;');
    });

    it('should set overflow-y: scroll if request count <= 0 and isLoad is true', () => {
      (store.select as jest.Mock).mockReturnValueOnce(of(0));
      component.isLoad = true;
      component.ngOnInit();
      expect(htmlElement!.setAttribute).toHaveBeenCalledWith('style', 'overflow-y: scroll;');
      expect(component.isLoad).toBe(false);
    });

    it('should not set overflow-y if request count <= 0 and isLoad is false', () => {
      (store.select as jest.Mock).mockReturnValueOnce(of(0));
      component.isLoad = false;
      component.ngOnInit();
      expect(htmlElement!.setAttribute).not.toHaveBeenCalledWith('style', 'overflow-y: scroll;');
    });
  });

  describe('modal open subscription', () => {
    it('should set overflow-y: hidden if open is true and openModal is false', (done) => {
      const openModal$ = new Subject<boolean>();

      (store.select as jest.Mock).mockImplementation((selector) => {
        if (selector === GetRequest) return of(0);
        if (selector === GetOpenModal) return openModal$.asObservable();
        if (selector === GetModal) return of({ title: '', content: '', isOpen: false });
        return of(null);
      });

      component.openModal = false;
      component.ngOnInit();

      openModal$.next(true);

      Promise.resolve().then(() => {
        expect(htmlElement!.setAttribute).toHaveBeenCalledWith('style', 'overflow-y: hidden;');
        expect(component.openModal).toBe(true);
        done();
      });
    });

    it('should not set overflow-y if open is true and openModal is true', (done) => {
      const openModal$ = new Subject<boolean>();

      (store.select as jest.Mock).mockImplementation((selector) => {
        if (selector === GetRequest) return of(0);
        if (selector === GetOpenModal) return openModal$.asObservable();
        if (selector === GetModal) return of({ title: '', content: '', isOpen: false });
        return of(null);
      });

      component.openModal = true;
      component.ngOnInit();

      openModal$.next(true);

      Promise.resolve().then(() => {
        expect(htmlElement!.setAttribute).not.toHaveBeenCalledWith('style', 'overflow-y: hidden;');
        done();
      });
    });

    it('should set overflow-y: scroll if open is false and openModal is true', () => {
      (store.select as jest.Mock).mockReturnValueOnce(of(false));
      component.openModal = true;
      component.ngOnInit();
      expect(htmlElement!.setAttribute).toHaveBeenCalledWith('style', 'overflow-y: scroll;');
      expect(component.openModal).toBe(false);
    });

    it('should not set overflow-y if open is false and openModal is false', () => {
      (store.select as jest.Mock).mockReturnValueOnce(of(false));
      component.openModal = false;
      component.ngOnInit();
      expect(htmlElement!.setAttribute).not.toHaveBeenCalledWith('style', 'overflow-y: scroll;');
    });
  });

  describe('modal data subscription', () => {
    it('should update modalData when GetModal emits a new value', (done) => {
      const newModalData: ModalData = { title: 'New Title', content: 'New Content', isOpen: true };
      const modalData$ = new Subject<ModalData>();

      (store.select as jest.Mock).mockImplementation((selector) => {
        if (selector === GetRequest) return of(0);
        if (selector === GetOpenModal) return of(false);
        if (selector === GetModal) return modalData$.asObservable();
        return of(null);
      });

      component.ngOnInit();

      modalData$.next(newModalData);

      Promise.resolve().then(() => {
        expect(component.modalData).toEqual(newModalData);
        done();
      });
    });
  });

  describe('ngOnDestroy', () => {
    it('should unsubscribe from openLoaderSubscribe if it exists', () => {
      component.openLoaderSubscribe = { unsubscribe: jest.fn() } as Subscription | any;
      component.ngOnDestroy();
      expect(component.openLoaderSubscribe!.unsubscribe).toHaveBeenCalledTimes(1);
    });

    it('should unsubscribe from openModalSubscribe if it exists', () => {
      component.openModalSubscribe = { unsubscribe: jest.fn() } as Subscription | any;
      component.ngOnDestroy();
      expect(component.openModalSubscribe!.unsubscribe).toHaveBeenCalledTimes(1);
    });

    it('should unsubscribe from modalDataSubscribe if it exists', () => {
      component.modalDataSubscribe = { unsubscribe: jest.fn() } as Subscription | any;
      component.ngOnDestroy();
      expect(component.modalDataSubscribe!.unsubscribe).toHaveBeenCalledTimes(1);
    });

    it('should not throw error if subscriptions are undefined', () => {
      component.openLoaderSubscribe = undefined;
      component.openModalSubscribe = undefined;
      component.modalDataSubscribe = undefined;
      expect(() => component.ngOnDestroy()).not.toThrow();
    });
  });
});
