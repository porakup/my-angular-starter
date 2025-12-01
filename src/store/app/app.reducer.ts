import { Action, createReducer, on } from '@ngrx/store';
import { AddRequestAction, ClearAppAction, ClearModalAction, RequestDoneAction, SetLanguageAction, SetModalAction } from './app.actions';
import { AppState, initialAppState } from './app.state';

const _appReducer = createReducer(
  initialAppState,
  on(AddRequestAction, (state: AppState) => {
    let req: number = state.request || 0;
    req++;
    return {
      ...state,
      request: req,
    };
  }),
  on(RequestDoneAction, (state: AppState) => {
    let req: number = state.request || 0;
    req--;
    if (req < 0) {
      req = 0;
    }
    return {
      ...state,
      request: req,
    };
  }),
  on(SetLanguageAction, (state: AppState, action: any) => {
    return {
      ...state,
      language: action.language,
    };
  }),
  on(SetModalAction, (state: AppState, action: any) => {
    return {
      ...state,
      modal: action.modal,
    };
  }),
  on(ClearModalAction, (state: AppState) => {
    return {
      ...state,
      modal: initialAppState.modal,
    };
  }),
  on(ClearAppAction, () => {
    const language = localStorage.getItem('my-angular-starter-language');
    return { ...initialAppState, language: language ? language : 'en' };
  })
);

export default function appReducer(state: AppState | undefined, action: Action) {
  return _appReducer(state, action);
}
