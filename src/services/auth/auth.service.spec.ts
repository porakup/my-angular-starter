import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { LoginData } from '../../models/login-data.model';
import { UserData } from '../../models/user-data.model';
import { ClearAuthAction, SetAuthAction } from '../../store/auth/auth.actions';
import { GetAuthState } from '../../store/auth/auth.getters';
import { GetAppState } from '../../store/app/app.getters';
import { ClearAppAction } from '../../store/app/app.actions';
import { StoreService } from '../store/store.service';

describe('AuthService', () => {
  let service: AuthService;
  let router: Router;
  let storeService: StoreService;
  const mockUser: UserData = {
    userId: '123',
    firstNameTh: 'ยูสเซอร์',
    lastNameTh: 'เดฟ',
    firstNameEn: 'User',
    lastNameEn: 'Dev',
    email: 'user@dev.example',
    isLoggedIn: true,
  };

  beforeEach(() => {
    router = {
      navigateByUrl: jest.fn().mockResolvedValue(true),
    } as Partial<Router> as Router;

    storeService = {
      asyncDispatch: jest.fn(),
    } as Partial<StoreService> as StoreService;

    service = new AuthService(router, storeService);
    localStorage.clear();
  });

  describe('login', () => {
    it('should successfully log in a user with correct credentials', async () => {
      const loginRequest: LoginData = { username: 'username', password: 'password' };
      await service.login(loginRequest);
      expect(localStorage.getItem('my-angular-starter-user')).toBe(JSON.stringify(mockUser));
      expect(storeService.asyncDispatch).toHaveBeenCalledWith(SetAuthAction(mockUser), GetAuthState);
      expect(router.navigateByUrl).toHaveBeenCalledWith('/product');
    });

    it('should not log in a user with incorrect credentials', async () => {
      const loginRequest: LoginData = { username: 'incorrect', password: 'incorrect' };
      await service.login(loginRequest);
      expect(localStorage.getItem('my-angular-starter-user')).toBeNull();
      expect(storeService.asyncDispatch).not.toHaveBeenCalled();
      expect(router.navigateByUrl).not.toHaveBeenCalled();
    });
  });

  describe('setAuth', () => {
    it('should dispatch SetAuthAction and select GetAuthState', async () => {
      await service.setAuth(mockUser);
      expect(storeService.asyncDispatch).toHaveBeenCalledWith(SetAuthAction(mockUser), GetAuthState);
    });
  });

  describe('getAccessToken', () => {
    it('should return a predefined access token', async () => {
      const accessToken = await service.getAccessToken();
      expect(accessToken).toBe('access token');
    });
  });

  describe('getRefreshToken', () => {
    it('should return a predefined refresh token', async () => {
      const refreshToken = await service.getRefreshToken();
      expect(refreshToken).toBe('refresh token');
    });
  });

  describe('logout', () => {
    it('should dispatch ClearAuthAction, select GetAuthState, dispatch ClearAppAction, select GetAppState, remove user from localStorage, and navigate to /login', async () => {
      localStorage.setItem('my-angular-starter-user', JSON.stringify(mockUser));
      await service.logout();
      expect(storeService.asyncDispatch).toHaveBeenCalledWith(ClearAuthAction(), GetAuthState);
      expect(storeService.asyncDispatch).toHaveBeenCalledWith(ClearAppAction(), GetAppState);
      expect(localStorage.getItem('my-angular-starter-user')).toBeNull();
      expect(router.navigateByUrl).toHaveBeenCalledWith('/login');
    });
  });
});
