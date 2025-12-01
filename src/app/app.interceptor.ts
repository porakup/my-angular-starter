import { HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, from, switchMap } from 'rxjs';
import { AuthService } from '../services/auth/auth.service';
import { LoaderService } from '../services/loader/loader.service';
import { ModalData } from '../models/modal-data.model';
import { ModalService } from '../services/modal/modal.service';
import environment from '../environments/environment';
import { SKIP_BASE_API, SKIP_LOADER } from './api-context.tokens';

export const appInterceptor: HttpInterceptorFn = (request, next) => {
  const authService = inject(AuthService);
  const loaderService = inject(LoaderService);
  const modalService = inject(ModalService);

  return from(asyncHandleRequest(authService, loaderService, request)).pipe(
    switchMap((mapRequest) => next(mapRequest)),
    catchError((error) => {
      if (error.status === 401) {
        return from(asyncHandleTokenExpired(authService, request)).pipe(
          switchMap((newRequest) => next(newRequest)),
          catchError((newError) =>
            from(asyncHandleError(modalService, loaderService, newError, request)).pipe(
              switchMap(() => {
                throw newError;
              })
            )
          )
        );
      } else {
        return from(asyncHandleError(modalService, loaderService, error, request)).pipe(
          switchMap(() => {
            throw error;
          })
        );
      }
    })
  );
};

const asyncHandleRequest = async (
  authService: AuthService,
  loaderService: LoaderService,
  request: HttpRequest<unknown>
): Promise<HttpRequest<unknown>> => {
  const skipBaseApi = request.context.get(SKIP_BASE_API);
  const skipLoader = request.context.get(SKIP_LOADER);

  if (!skipLoader) {
    await loaderService.openLoader();
  }

  let modifiedRequest = request;

  if (!skipBaseApi && !request.url.startsWith('http')) {
    modifiedRequest = modifiedRequest.clone({
      url: `${environment.apiUrl}/${request.url}`,
    });
  }

  const accessToken = await authService.getAccessToken();
  if (accessToken) {
    modifiedRequest = modifiedRequest.clone({
      setHeaders: { Authorization: `Bearer ${accessToken}` },
    });
  }

  return modifiedRequest;
};

const asyncHandleTokenExpired = async (
  authService: AuthService,
  request: HttpRequest<unknown>
): Promise<HttpRequest<unknown>> => {
  const newAccessToken = await authService.getRefreshToken();
  if (newAccessToken) {
    return request.clone({
      setHeaders: { Authorization: `Bearer ${newAccessToken}` },
    });
  }
  return request;
};

const asyncHandleError = async (
  modalService: ModalService,
  loaderService: LoaderService,
  error: any,
  request: HttpRequest<unknown>
): Promise<void> => {
  const skipLoader = request.context.get(SKIP_LOADER);
  if (!skipLoader) {
    await loaderService.closeLoader();
  }

  const title = 'Example Error Title';
  const content = 'Example Error Message.';

  const modalData: ModalData = { title, content };
  await modalService.openModal(modalData);
};
