import { Router } from '@angular/router';
import { ErrorPage } from './error.page';
describe('ErrorPage', () => {
  let component: ErrorPage;
  let router: Router;

  beforeEach(() => {
    router = {
      navigateByUrl: jest.fn().mockResolvedValue(true),
    } as Partial<Router> as Router;

    component = new ErrorPage(router);
  });

  describe('back', () => {
    it('should navigate to the home page ("/")', () => {
      component.back();
      expect(router.navigateByUrl).toHaveBeenCalledWith('/');
    });
  });
});
