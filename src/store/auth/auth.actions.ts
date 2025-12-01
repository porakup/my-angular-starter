import { createAction, props } from '@ngrx/store';
import { UserData } from '../../models/user-data.model';

export const SetAuthAction = createAction('[Auth] Set Auth', props<UserData>());

export const ClearAuthAction = createAction('[Auth] Clear Auth');
