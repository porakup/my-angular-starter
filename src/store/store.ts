import { ActionReducerMap } from '@ngrx/store';
import appReducer from './app/app.reducer';
import { AppState } from './app/app.state';
import authReducer from './auth/auth.reducer';
import { AuthState } from './auth/auth.state';

interface StoreState {
  app: AppState;
  auth: AuthState;
}

const store: ActionReducerMap<StoreState> = {
  auth: authReducer,
  app: appReducer,
};

export default store;
