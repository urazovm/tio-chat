import { SpoonadoPage } from './app.po';

describe('spoonado App', function() {
  let page: SpoonadoPage;

  beforeEach(() => {
    page = new SpoonadoPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('spoonado works!');
  });
});
