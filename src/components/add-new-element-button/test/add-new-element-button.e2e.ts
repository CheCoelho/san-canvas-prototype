import { newE2EPage } from '@stencil/core/testing';

describe('add-new-element-button', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<add-new-element-button></add-new-element-button>');

    const element = await page.find('add-new-element-button');
    expect(element).toHaveClass('hydrated');
  });
});
