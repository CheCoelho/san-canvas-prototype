import { newE2EPage } from '@stencil/core/testing';

describe('node-editor-component', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<node-editor-component></node-editor-component>');

    const element = await page.find('node-editor-component');
    expect(element).toHaveClass('hydrated');
  });
});
