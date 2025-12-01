import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AuthState } from './auth.state';

export const authState = createFeatureSelector<AuthState>('auth');

export const GetAuthState = createSelector(authState, (state: AuthState) => state);

export const GetUserId = createSelector(authState, (state: AuthState) => state.userId);

export const GetFirstNameTh = createSelector(authState, (state: AuthState) => state.firstNameTh);

export const GetLastNameTh = createSelector(authState, (state: AuthState) => state.lastNameTh);

export const GetFirstNameEn = createSelector(authState, (state: AuthState) => state.firstNameEn);

export const GetLastNameEn = createSelector(authState, (state: AuthState) => state.lastNameEn);

export const GetEmail = createSelector(authState, (state: AuthState) => state.email);

export const GetisLoggedIn = createSelector(authState, (state: AuthState) => state.isLoggedIn);
