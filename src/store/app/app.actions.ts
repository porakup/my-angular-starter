import { createAction, props } from '@ngrx/store';
import { ModalData } from '../../models/modal-data.model';

export const AddRequestAction = createAction('[App] Add Request');

export const RequestDoneAction = createAction('[App] Request Done');

export const SetLanguageAction = createAction('[App] Set Language', props<{ language: string }>());

export const SetModalAction = createAction('[App] Set Modal', props<{ modal: ModalData }>());

export const ClearModalAction = createAction('[App] Clear Modal');

export const ClearAppAction = createAction('[App] Clear App');
