import { Action, createReducer, on } from '@ngrx/store';
import { UserData } from '../../models/user-data.model';
import { ClearAuthAction, SetAuthAction } from './auth.actions';
import { AuthState, initialAuthState } from './auth.state';

const _authReducer = createReducer(
  initialAuthState,
  on(SetAuthAction, (_, action: UserData) => ({
    userId: action.userId,
    firstNameTh: action.firstNameTh,
    lastNameTh: action.lastNameTh,
    firstNameEn: action.firstNameEn,
    lastNameEn: action.lastNameEn,
    email: action.email,
    isLoggedIn: action.isLoggedIn,
  })),
  on(ClearAuthAction, () => ({
    userId: '',
    firstNameTh: '',
    lastNameTh: '',
    firstNameEn: '',
    lastNameEn: '',
    email: '',
    isLoggedIn: false,
  }))
);

export default function authReducer(state: AuthState | undefined, action: Action) {
  return _authReducer(state, action);
}
