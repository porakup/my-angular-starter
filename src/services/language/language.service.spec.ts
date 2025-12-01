import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from './language.service';
import { SetLanguageAction } from '../../store/app/app.actions';
import { GetLanguage } from '../../store/app/app.getters';
import { StoreService } from '../store/store.service';

describe('LanguageService', () => {
  let service: LanguageService;
  let storeService: StoreService;
  let translateService: TranslateService;

  beforeEach(() => {
    storeService = {
      asyncDispatch: jest.fn(),
    } as Partial<StoreService> as StoreService;

    translateService = {
      use: jest.fn(),
    } as Partial<TranslateService> as TranslateService;

    service = new LanguageService(storeService, translateService);
    localStorage.clear();
  });

  describe('changeLanguage', () => {
    it('should set language in localStorage, use TranslateService, and dispatch SetLanguageAction', async () => {
      const language = 'th';
      await service.changeLanguage(language);
      expect(localStorage.getItem('my-angular-starter-language')).toBe(language);
      expect(translateService.use).toHaveBeenCalledWith(language);
      expect(storeService.asyncDispatch).toHaveBeenCalledWith(SetLanguageAction({ language }), GetLanguage);
    });
  });

  describe('setLanguage', () => {
    it('should use TranslateService, and dispatch SetLanguageAction', async () => {
      const language = 'th';
      await service.setLanguage(language);
      expect(translateService.use).toHaveBeenCalledWith(language);
      expect(storeService.asyncDispatch).toHaveBeenCalledWith(SetLanguageAction({ language }), GetLanguage);
    });
  });
});
