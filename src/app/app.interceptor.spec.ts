import { HttpRequest, HttpContext } from '@angular/common/http';
import { of, firstValueFrom } from 'rxjs';
import { appInterceptor } from './app.interceptor';
import { SKIP_BASE_API, SKIP_LOADER } from './api-context.tokens';

const mockAuthService = {
  getAccessToken: jest.fn(),
  getRefreshToken: jest.fn(),
};

const mockLoaderService = {
  openLoader: jest.fn(),
  closeLoader: jest.fn(),
};

const mockModalService = {
  openModal: jest.fn(),
};

jest.mock('@angular/core', () => {
  const actual = jest.requireActual('@angular/core');
  return {
    ...actual,
    inject: (token: any) => {
      switch (token.name) {
        case 'AuthService':
          return mockAuthService;
        case 'LoaderService':
          return mockLoaderService;
        case 'ModalService':
          return mockModalService;
        default:
          throw new Error('Unknown dependency');
      }
    },
  };
});

describe('appInterceptor', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should add Authorization header if access token is not empty', async () => {
    mockLoaderService.openLoader.mockResolvedValue(undefined);
    mockAuthService.getAccessToken.mockResolvedValue('mock-token');
    const mockRequest = new HttpRequest('GET', '/api/test');
    const next = jest.fn((req) => of(req));

    await firstValueFrom(appInterceptor(mockRequest, next));

    const calledRequest: HttpRequest<any> = next.mock.calls[0][0];
    expect(mockLoaderService.openLoader).toHaveBeenCalled();
    expect(mockAuthService.getAccessToken).toHaveBeenCalled();
    expect(calledRequest.headers.get('Authorization')).toBe('Bearer mock-token');
    expect(calledRequest.url).toContain('/api/test');
  });

  it('should not add Authorization header if access token is empty', async () => {
    mockLoaderService.openLoader.mockResolvedValue(undefined);
    mockAuthService.getAccessToken.mockResolvedValue('');
    const mockRequest = new HttpRequest('GET', '/api/test');
    const next = jest.fn((req) => of(req));

    await firstValueFrom(appInterceptor(mockRequest, next));

    const calledRequest: HttpRequest<any> = next.mock.calls[0][0];
    expect(mockLoaderService.openLoader).toHaveBeenCalled();
    expect(mockAuthService.getAccessToken).toHaveBeenCalled();
    expect(calledRequest.headers.get('Authorization')).toBeNull();
    expect(calledRequest.url).toContain('/api/test');
  });

  it('should skip loader when SKIP_LOADER is true', async () => {
    const context = new HttpContext().set(SKIP_LOADER, true);
    mockAuthService.getAccessToken.mockResolvedValue('mock-token');
    const mockRequest = new HttpRequest('GET', '/api/test', { context });
    const next = jest.fn((req) => of(req));

    await firstValueFrom(appInterceptor(mockRequest, next));

    expect(mockLoaderService.openLoader).not.toHaveBeenCalled();
  });

  it('should not prepend base URL when SKIP_BASE_API is true', async () => {
    const context = new HttpContext().set(SKIP_BASE_API, true);
    mockLoaderService.openLoader.mockResolvedValue(undefined);
    mockAuthService.getAccessToken.mockResolvedValue('mock-token');
    const url = 'https://localhost:8080/api/v0';
    const mockRequest = new HttpRequest('GET', url, { context });
    const next = jest.fn((req) => of(req));

    await firstValueFrom(appInterceptor(mockRequest, next));

    const calledRequest = next.mock.calls[0][0];
    expect(calledRequest.url).toBe(url);
  });

  it('should retry with refresh token on 401 error', async () => {
    mockLoaderService.openLoader.mockResolvedValue(undefined);
    mockAuthService.getAccessToken.mockResolvedValue('expired-token');
    mockAuthService.getRefreshToken.mockResolvedValue('new-token');
    const mockRequest = new HttpRequest('GET', '/api/test');
    const next = jest
      .fn()
      .mockImplementationOnce(() => {
        throw { status: 401 };
      })
      .mockImplementationOnce((req) => of(req));

    await firstValueFrom(appInterceptor(mockRequest, next));

    const retriedRequest: HttpRequest<any> = next.mock.calls[1][0];
    expect(mockAuthService.getRefreshToken).toHaveBeenCalled();
    expect(retriedRequest.headers.get('Authorization')).toBe('Bearer new-token');
  });

  it('should retry original request without new token if getRefreshToken returns null', async () => {
    mockLoaderService.openLoader.mockResolvedValue(undefined);
    mockAuthService.getAccessToken.mockResolvedValue('expired-token');
    mockAuthService.getRefreshToken.mockResolvedValue(null);
    const mockRequest = new HttpRequest('GET', '/api/test');
    const next = jest
      .fn()
      .mockImplementationOnce(() => {
        throw { status: 401 };
      })
      .mockImplementationOnce((req) => of(req));

    await firstValueFrom(appInterceptor(mockRequest, next));

    const retriedRequest = next.mock.calls[1][0];
    expect(mockAuthService.getRefreshToken).toHaveBeenCalled();
    expect(retriedRequest.headers.get('Authorization')).toBeNull();
  });

  it('should show modal and close loader on non-401 error', async () => {
    mockLoaderService.openLoader.mockResolvedValue(undefined);
    mockAuthService.getAccessToken.mockResolvedValue('valid-token');
    mockLoaderService.closeLoader.mockResolvedValue(undefined);
    const mockRequest = new HttpRequest('GET', '/api/test');
    const next = jest.fn(() => {
      throw { status: 500 };
    });

    await expect(firstValueFrom(appInterceptor(mockRequest, next))).rejects.toEqual({
      status: 500,
    });

    expect(mockLoaderService.closeLoader).toHaveBeenCalled();
    expect(mockModalService.openModal).toHaveBeenCalledWith({
      title: 'Example Error Title',
      content: 'Example Error Message.',
    });
  });

  it('should show modal and open loader on non-401 error and skipLoader is true', async () => {
    const context = new HttpContext().set(SKIP_LOADER, true);
    mockLoaderService.openLoader.mockResolvedValue(undefined);
    mockAuthService.getAccessToken.mockResolvedValue('');
    mockLoaderService.closeLoader.mockResolvedValue(undefined);
    const mockRequest = new HttpRequest('GET', '/api/test', { context });
    const next = jest.fn(() => {
      throw { status: 500 };
    });

    await expect(firstValueFrom(appInterceptor(mockRequest, next))).rejects.toEqual({
      status: 500,
    });

    expect(mockLoaderService.closeLoader).not.toHaveBeenCalled();
    expect(mockModalService.openModal).toHaveBeenCalledWith({
      title: 'Example Error Title',
      content: 'Example Error Message.',
    });
  });

  it('should show modal and close loader when retry after 401 also fails', async () => {
    mockLoaderService.openLoader.mockResolvedValue(undefined);
    mockAuthService.getAccessToken.mockResolvedValue('expired-token');
    mockAuthService.getRefreshToken.mockResolvedValue('new-token');
    mockLoaderService.closeLoader.mockResolvedValue(undefined);
    const mockRequest = new HttpRequest('GET', '/api/test');
    const next = jest
      .fn()
      .mockImplementationOnce(() => {
        throw { status: 401 };
      })
      .mockImplementationOnce(() => {
        throw { status: 403 };
      });

    await expect(firstValueFrom(appInterceptor(mockRequest, next))).rejects.toEqual({
      status: 403,
    });

    expect(mockLoaderService.closeLoader).toHaveBeenCalled();
    expect(mockModalService.openModal).toHaveBeenCalledWith({
      title: 'Example Error Title',
      content: 'Example Error Message.',
    });
  });
});
