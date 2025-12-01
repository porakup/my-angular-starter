import { TranslateLoader } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';
import { en } from '../i18n/en';
import { th } from '../i18n/th';

export class AppTranslate implements TranslateLoader {
  getTranslation(lang: string): Observable<any> {
    return of(lang === 'th' ? th : en);
  }
}
