export class SpoonadoPage {
  navigateTo() {
    return browser.get('/');
  }

  getParagraphText() {
    return element(by.css('spoonado-app h1')).getText();
  }
}
