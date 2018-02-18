import { PapersubmissionUiPage } from './app.po';

describe('papersubmission-ui App', function() {
  let page: PapersubmissionUiPage;

  beforeEach(() => {
    page = new PapersubmissionUiPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
