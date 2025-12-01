import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { LoginData } from '../../models/login-data.model';
import { UserData } from '../../models/user-data.model';
import { ClearAppAction } from '../../store/app/app.actions';
import { GetAppState } from '../../store/app/app.getters';
import { ClearAuthAction, SetAuthAction } from '../../store/auth/auth.actions';
import { GetAuthState } from '../../store/auth/auth.getters';
import { AuthState } from '../../store/auth/auth.state';
import { AppState } from '../../store/app/app.state';
import { StoreService } from '../store/store.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private router: Router, private storeService: StoreService) {}

  async login(request: LoginData): Promise<void> {
    const { username, password } = request;
    let user: UserData;
    if (username === 'username' && password === 'password') {
      user = {
        userId: '123',
        firstNameTh: 'ยูสเซอร์',
        lastNameTh: 'เดฟ',
        firstNameEn: 'User',
        lastNameEn: 'Dev',
        email: 'user@dev.example',
        isLoggedIn: true,
      };
      localStorage.setItem('my-angular-starter-user', JSON.stringify(user));
      await this.setAuth(user);
      this.router.navigateByUrl('/product');
    }
  }

  async setAuth(user: UserData): Promise<void> {
    await this.storeService.asyncDispatch<AuthState>(SetAuthAction(user), GetAuthState);
  }

  async getAccessToken(): Promise<string> {
    return 'access token';
  }

  async getRefreshToken(): Promise<string> {
    return 'refresh token';
  }

  async logout(): Promise<void> {
    await this.storeService.asyncDispatch<AuthState>(ClearAuthAction(), GetAuthState);
    await this.storeService.asyncDispatch<AppState>(ClearAppAction(), GetAppState);
    localStorage.removeItem('my-angular-starter-user');
    this.router.navigateByUrl('/login');
  }
}
