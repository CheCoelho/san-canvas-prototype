import { newE2EPage } from '@stencil/core/testing';

describe('node-element', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<node-element></node-element>');

    const element = await page.find('node-element');
    expect(element).toHaveClass('hydrated');
  });
});
