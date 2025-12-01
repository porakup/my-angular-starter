import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UserData } from '../models/user-data.model';
import { AuthService } from '../services/auth/auth.service';
import { LanguageService } from '../services/language/language.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: true,
  imports: [RouterOutlet],
})
export class AppComponent implements OnInit {
  constructor(private languageService: LanguageService, private authService: AuthService) {}

  async ngOnInit(): Promise<void> {
    const data: string | null = localStorage.getItem('my-angular-starter-user');
    if (data) {
      const user: UserData = JSON.parse(data);
      await this.authService.setAuth(user);
    }
    const language = localStorage.getItem('my-angular-starter-language');
    if (language) {
      await this.languageService.setLanguage(language);
    }
  }
}
