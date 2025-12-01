import { AppTranslate } from './app.translate';
import { en } from '../i18n/en';
import { th } from '../i18n/th';
import { lastValueFrom } from 'rxjs';

describe('AppTranslate', () => {
  let appTranslate: AppTranslate;

  beforeEach(() => {
    appTranslate = new AppTranslate();
  });

  it('should return Thai translations when language is "th"', async () => {
    const result = await lastValueFrom(appTranslate.getTranslation('th'));
    expect(result).toEqual(th);
  });

  it('should return English translations when language is not "th"', async () => {
    const result = await lastValueFrom(appTranslate.getTranslation('en'));
    expect(result).toEqual(en);
  });
});
