import { Store } from '@ngrx/store';
import { AuthService } from '../../services/auth/auth.service';
import { LanguageService } from '../../services/language/language.service';
import { GetLanguage } from '../../store/app/app.getters';
import { LoginPage } from './login.page';
import { of } from 'rxjs';
import { LoginData } from '../../models/login-data.model';

describe('LoginPage', () => {
  let component: LoginPage;
  let authService: AuthService;
  let languageService: LanguageService;
  let store: Store;

  beforeEach(() => {
    authService = {
      login: jest.fn().mockResolvedValue(undefined),
    } as Partial<AuthService> as AuthService;

    languageService = {
      changeLanguage: jest.fn().mockResolvedValue(undefined),
    } as Partial<LanguageService> as LanguageService;

    store = {
      select: jest.fn((selector) => {
        if (selector === GetLanguage) return of('en');
        return of(null);
      }),
    } as Partial<Store> as Store;

    component = new LoginPage(authService, languageService, store);
  });

  it('should initialize username and password', () => {
    expect(component.username).toBe('username');
    expect(component.password).toBe('password');
  });

  it('should select language from the store on ngOnInit', () => {
    component.ngOnInit();
    expect(store.select).toHaveBeenCalledWith(GetLanguage);
  });

  it('login should call login with current username and password', async () => {
    component.username = 'testUser';
    component.password = 'testPass';
    await component.login();
    expect(authService.login).toHaveBeenCalledWith({ username: 'testUser', password: 'testPass' } as LoginData);
  });

  it('setLanguage should call changeLanguage with the provided language', async () => {
    const lang = 'th';
    await component.setLanguage(lang);
    expect(languageService.changeLanguage).toHaveBeenCalledWith(lang);
  });
});
