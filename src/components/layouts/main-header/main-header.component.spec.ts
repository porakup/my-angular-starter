import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { LanguageService } from '../../../services/language/language.service';
import { AuthService } from '../../../services/auth/auth.service';
import { GetFirstNameEn, GetFirstNameTh, GetLastNameEn, GetLastNameTh } from '../../../store/auth/auth.getters';
import { GetLanguage } from '../../../store/app/app.getters';
import { MainHeaderComponent } from './main-header.component';

describe('MainHeaderComponent', () => {
  let component: MainHeaderComponent;
  let languageService: LanguageService;
  let authService: AuthService;
  let store: Store;
  let router: Router;

  const mockFirstNameTh$ = of('ยูสเซอร์');
  const mockLastNameTh$ = of('เดฟ');
  const mockFirstNameEn$ = of('User');
  const mockLastNameEn$ = of('Dev');
  const mockLanguageTh$ = of('th');
  const mockLanguageEn$ = of('en');

  beforeEach(() => {
    languageService = {
      changeLanguage: jest.fn().mockResolvedValue(undefined),
    } as Partial<LanguageService> as LanguageService;

    authService = {
      logout: jest.fn().mockResolvedValue(undefined),
    } as Partial<AuthService> as AuthService;

    store = {
      select: jest.fn((selector) => {
        if (selector === GetFirstNameTh) return mockFirstNameTh$;
        if (selector === GetLastNameTh) return mockLastNameTh$;
        if (selector === GetFirstNameEn) return mockFirstNameEn$;
        if (selector === GetLastNameEn) return mockLastNameEn$;
        if (selector === GetLanguage) return mockLanguageTh$;
        return of(null);
      }),
    } as Partial<Store> as Store;

    router = {} as Partial<Router> as Router;

    component = new MainHeaderComponent(languageService, authService, store, router);
  });

  it('should select user data and language from the store on ngOnInit', () => {
    component.ngOnInit();
    expect(store.select).toHaveBeenCalledWith(GetFirstNameTh);
    expect(store.select).toHaveBeenCalledWith(GetLastNameTh);
    expect(store.select).toHaveBeenCalledWith(GetFirstNameEn);
    expect(store.select).toHaveBeenCalledWith(GetLastNameEn);
    expect(store.select).toHaveBeenCalledWith(GetLanguage);
  });

  it('userName$ should emit Thai name when language is "th"', (done) => {
    component.ngOnInit();
    component.userName$?.subscribe((userName) => {
      expect(userName).toEqual({ firstName: 'ยูสเซอร์', lastName: 'เดฟ' });
      done();
    });
  });

  it('userName$ should emit English name when language is "en"', (done) => {
    (store.select as jest.Mock).mockImplementation((selector) => {
      if (selector === GetFirstNameTh) return mockFirstNameTh$;
      if (selector === GetLastNameTh) return mockLastNameTh$;
      if (selector === GetFirstNameEn) return mockFirstNameEn$;
      if (selector === GetLastNameEn) return mockLastNameEn$;
      if (selector === GetLanguage) return mockLanguageEn$;
      return of(null);
    });

    component.ngOnInit();
    component.userName$?.subscribe((userName) => {
      expect(userName).toEqual({ firstName: 'User', lastName: 'Dev' });
      done();
    });
  });

  it('setLanguage should call changeLanguage', async () => {
    await component.setLanguage('en');
    expect(languageService.changeLanguage).toHaveBeenCalledWith('en');
  });

  it('logout should call logout', async () => {
    await component.logout();
    expect(authService.logout).toHaveBeenCalled();
  });
});
