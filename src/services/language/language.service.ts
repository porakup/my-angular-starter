import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { SetLanguageAction } from '../../store/app/app.actions';
import { GetLanguage } from '../../store/app/app.getters';
import { AppState } from '../../store/app/app.state';
import { StoreService } from '../store/store.service';

@Injectable({ providedIn: 'root' })
export class LanguageService {
  constructor(private storeService: StoreService, private translateService: TranslateService) {}

  async changeLanguage(language: string): Promise<void> {
    this.translateService.use(language);
    localStorage.setItem('my-angular-starter-language', language);
    await this.storeService.asyncDispatch<AppState, string>(SetLanguageAction({ language }), GetLanguage);
  }

  async setLanguage(language: string): Promise<void> {
    this.translateService.use(language);
    await this.storeService.asyncDispatch<AppState, string>(SetLanguageAction({ language }), GetLanguage);
  }
}
