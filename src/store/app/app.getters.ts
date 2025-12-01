import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AppState } from './app.state';

export const appState = createFeatureSelector<AppState>('app');

export const GetAppState = createSelector(appState, (state: AppState) => state);

export const GetRequest = createSelector(appState, (state: AppState) => state.request);

export const GetLanguage = createSelector(appState, (state: AppState) => state.language);

export const GetModal = createSelector(appState, (state: AppState) => state.modal);

export const GetOpenModal = createSelector(appState, (state: AppState) => state.modal.isOpen);
