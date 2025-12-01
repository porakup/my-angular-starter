import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { I18NPipe } from '../../utils/pipes/i18n/i18n.pipe';

@Component({
  selector: 'error-page',
  templateUrl: './error.page.html',
  standalone: true,
  imports: [FormsModule, I18NPipe],
})
export class ErrorPage {
  constructor(private router: Router) {}

  back() {
    this.router.navigateByUrl('/');
  }
}
