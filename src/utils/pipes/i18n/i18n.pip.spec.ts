import { ChangeDetectorRef, EventEmitter } from '@angular/core';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { I18NPipe } from './i18n.pipe';
import { Subject } from 'rxjs';

describe('I18NPipe', () => {
  let pipe: I18NPipe;
  let translateService: TranslateService;
  let cdr: ChangeDetectorRef;
  let langChangeSubject: Subject<LangChangeEvent>;

  beforeEach(() => {
    langChangeSubject = new Subject<LangChangeEvent>();

    translateService = {
      instant: jest.fn((key: string) => `TRANSLATED_${key}`),
      onLangChange: langChangeSubject as EventEmitter<LangChangeEvent>,
    } as Partial<TranslateService> as TranslateService;

    cdr = {
      markForCheck: jest.fn(),
    } as Partial<ChangeDetectorRef> as ChangeDetectorRef;

    pipe = new I18NPipe(translateService, cdr);
  });

  it('should return an empty string if value is null or undefined', () => {
    expect(pipe.transform(null)).toBe('');
    expect(pipe.transform(undefined)).toBe('');
  });

  it('should call translateService.instant with the value and args', () => {
    const value = 'TEST_KEY';
    const args = { param: 'test' };
    pipe.transform(value, args);
    expect(translateService.instant).toHaveBeenCalledWith(value, [args]);
  });

  it('should return the translated value', () => {
    const value = 'TEST_KEY';
    expect(pipe.transform(value)).toBe('TRANSLATED_TEST_KEY');
  });

  it('should return the same translated value if called with the same value again', () => {
    const value = 'TEST_KEY';
    const firstTranslation = pipe.transform(value);
    const secondTranslation = pipe.transform(value);
    expect(firstTranslation).toBe('TRANSLATED_TEST_KEY');
    expect(secondTranslation).toBe('TRANSLATED_TEST_KEY');
    expect(translateService.instant).toHaveBeenCalledTimes(2);
  });

  it('should return a new translated value if the value changes', () => {
    const value1 = 'TEST_KEY_1';
    const value2 = 'TEST_KEY_2';
    const firstTranslation = pipe.transform(value1);
    const secondTranslation = pipe.transform(value2);
    expect(firstTranslation).toBe('TRANSLATED_TEST_KEY_1');
    expect(secondTranslation).toBe('TRANSLATED_TEST_KEY_2');
    expect(translateService.instant).toHaveBeenCalledTimes(2);
  });

  it('should mark for check on language change', () => {
    expect(cdr.markForCheck).not.toHaveBeenCalled();
    langChangeSubject.next({ lang: 'en', translations: {} });
    expect(cdr.markForCheck).toHaveBeenCalledTimes(1);
  });

  it('should unsubscribe from onLangChange on ngOnDestroy', () => {
    const langChangeSub = (pipe as any).langChangeSub;

    expect(langChangeSub).toBeDefined();
    expect(langChangeSub.unsubscribe).toBeDefined();

    const unsubscribeSpy = jest.spyOn(langChangeSub, 'unsubscribe');
    pipe.ngOnDestroy();
    expect(unsubscribeSpy).toHaveBeenCalledTimes(1);
  });

  it('should not throw error if langChangeSub is not initialized on ngOnDestroy', () => {
    (pipe as any).langChangeSub = undefined;
    expect(() => pipe.ngOnDestroy()).not.toThrow();
  });
});
