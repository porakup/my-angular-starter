import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AuthService } from '../../services/auth/auth.service';
import { LanguageService } from '../../services/language/language.service';
import { GetLanguage } from '../../store/app/app.getters';
import { I18NPipe } from '../../utils/pipes/i18n/i18n.pipe';

@Component({
  selector: 'login-page',
  templateUrl: './login.page.html',
  standalone: true,
  imports: [FormsModule, CommonModule, I18NPipe],
})
export class LoginPage implements OnInit {
  constructor(private authService: AuthService, private languageService: LanguageService, private store: Store) {}

  username: string = 'username';
  password: string = 'password';

  language$: Observable<string | null> | undefined;

  ngOnInit(): void {
    this.language$ = this.store.select(GetLanguage);
  }

  async login(): Promise<void> {
    await this.authService.login({
      username: this.username,
      password: this.password,
    });
  }

  async setLanguage(lang: string): Promise<void> {
    await this.languageService.changeLanguage(lang);
  }
}
