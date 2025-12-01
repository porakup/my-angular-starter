import { HttpContextToken } from '@angular/common/http';

export const SKIP_BASE_API = new HttpContextToken<boolean>(() => false);
export const SKIP_LOADER = new HttpContextToken<boolean>(() => false);
