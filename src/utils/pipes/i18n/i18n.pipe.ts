import { ChangeDetectorRef, Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

@Pipe({
  name: 'i18n',
  pure: false,
  standalone: true,
})
export class I18NPipe implements PipeTransform {
  constructor(private translateService: TranslateService, private cdr: ChangeDetectorRef) {
    this.langChangeSub = this.translateService.onLangChange.subscribe(() => {
      this.cdr.markForCheck();
    });
  }

  private lastValue: string = '';
  private langChangeSub: Subscription;

  transform(value: any, ...args: any[]): any {
    if (!value) return '';
    const translatedValue = this.translateService.instant(value, args);
    if (this.lastValue !== translatedValue) {
      this.lastValue = translatedValue;
      return translatedValue;
    }

    return this.lastValue;
  }

  ngOnDestroy() {
    if (this.langChangeSub) {
      this.langChangeSub.unsubscribe();
    }
  }
}
