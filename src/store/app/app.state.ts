import { ModalData } from '../../models/modal-data.model';

export interface AppState {
  request: number;
  language: string;
  modal: ModalData;
}

export const initialAppState: AppState = {
  request: 0,
  language: 'en',
  modal: {
    title: '',
    content: '',
    yesFunc: async () => {},
    noFunc: async () => {},
    isOpen: false,
  },
};
