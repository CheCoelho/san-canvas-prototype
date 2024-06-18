import { newE2EPage } from '@stencil/core/testing';

describe('node-component', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<node-component></node-component>');

    const element = await page.find('node-component');
    expect(element).toHaveClass('hydrated');
  });
});
