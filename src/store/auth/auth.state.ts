export interface AuthState {
  userId: string;
  firstNameTh: string;
  lastNameTh: string;
  firstNameEn: string;
  lastNameEn: string;
  email: string;
  isLoggedIn: boolean;
}

export const initialAuthState: AuthState = {
  userId: '',
  firstNameTh: '',
  lastNameTh: '',
  firstNameEn: '',
  lastNameEn: '',
  email: '',
  isLoggedIn: false,
};
