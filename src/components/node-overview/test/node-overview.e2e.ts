import { newE2EPage } from '@stencil/core/testing';

describe('node-overview', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<node-overview></node-overview>');

    const element = await page.find('node-overview');
    expect(element).toHaveClass('hydrated');
  });
});
