import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, combineLatest, map } from 'rxjs';
import { AuthService } from '../../../services/auth/auth.service';
import { LanguageService } from '../../../services/language/language.service';
import { GetLanguage } from '../../../store/app/app.getters';
import { GetFirstNameEn, GetFirstNameTh, GetLastNameEn, GetLastNameTh } from '../../../store/auth/auth.getters';
import { I18NPipe } from '../../../utils/pipes/i18n/i18n.pipe';

@Component({
  selector: 'main-header',
  templateUrl: './main-header.component.html',
  standalone: true,
  imports: [CommonModule, I18NPipe],
})
export class MainHeaderComponent implements OnInit {
  constructor(private languageService: LanguageService, private authService: AuthService, private store: Store, private router: Router) {}

  firstNameTh$: Observable<string | null> | undefined;
  lastNameTh$: Observable<string | null> | undefined;
  firstNameEn$: Observable<string | null> | undefined;
  lastNameEn$: Observable<string | null> | undefined;
  language$: Observable<string | null> | undefined;
  userName$: Observable<{ firstName: string | null; lastName: string | null }> | undefined;

  ngOnInit(): void {
    this.firstNameTh$ = this.store.select(GetFirstNameTh);
    this.lastNameTh$ = this.store.select(GetLastNameTh);
    this.firstNameEn$ = this.store.select(GetFirstNameEn);
    this.lastNameEn$ = this.store.select(GetLastNameEn);
    this.language$ = this.store.select(GetLanguage);

    this.userName$ = combineLatest([this.firstNameTh$, this.lastNameTh$, this.firstNameEn$, this.lastNameEn$, this.language$]).pipe(
      map(([firstNameTh, lastNameTh, firstNameEn, lastNameEn, lang]) => {
        if (lang === 'th') {
          return { firstName: firstNameTh, lastName: lastNameTh };
        } else {
          return { firstName: firstNameEn, lastName: lastNameEn };
        }
      })
    );
  }

  async setLanguage(lang: string): Promise<void> {
    await this.languageService.changeLanguage(lang);
  }

  async logout(): Promise<void> {
    await this.authService.logout();
  }
}
