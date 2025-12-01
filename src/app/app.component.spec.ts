import { AppComponent } from './app.component';
import { AuthService } from '../services/auth/auth.service';
import { LanguageService } from '../services/language/language.service';
import { UserData } from '../models/user-data.model';

describe('AppComponent', () => {
  let component: AppComponent;
  let mockAuthService: jest.Mocked<AuthService>;
  let mockLanguageService: jest.Mocked<LanguageService>;

  beforeEach(() => {
    mockAuthService = {
      setAuth: jest.fn().mockResolvedValue(undefined),
    } as unknown as jest.Mocked<AuthService>;

    mockLanguageService = {
      setLanguage: jest.fn().mockResolvedValue(undefined),
    } as unknown as jest.Mocked<LanguageService>;

    component = new AppComponent(mockLanguageService, mockAuthService);
  });

  afterEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  it('should set auth if user data exists in localStorage', async () => {
    const user: UserData = { id: '123', name: 'Test User' } as any;
    localStorage.setItem('my-angular-starter-user', JSON.stringify(user));

    await component.ngOnInit();

    expect(mockAuthService.setAuth).toHaveBeenCalledWith(user);
  });

  it('should not set auth if no user data in localStorage', async () => {
    await component.ngOnInit();
    expect(mockAuthService.setAuth).not.toHaveBeenCalled();
  });

  it('should set language if it exists in localStorage', async () => {
    localStorage.setItem('my-angular-starter-language', 'th');

    await component.ngOnInit();

    expect(mockLanguageService.setLanguage).toHaveBeenCalledWith('th');
  });

  it('should not set language if none exists in localStorage', async () => {
    await component.ngOnInit();
    expect(mockLanguageService.setLanguage).not.toHaveBeenCalled();
  });
});
