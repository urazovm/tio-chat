import { TioChatPage } from './app.po';

describe('tio-chat App', function() {
  let page: TioChatPage;

  beforeEach(() => {
    page = new TioChatPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
