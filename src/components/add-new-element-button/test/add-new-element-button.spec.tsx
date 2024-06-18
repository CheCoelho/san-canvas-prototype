import { newSpecPage } from '@stencil/core/testing';
import { AddNewElementButton } from '../add-new-element-button';

describe('add-new-element-button', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [AddNewElementButton],
      html: `<add-new-element-button></add-new-element-button>`,
    });
    expect(page.root).toEqualHtml(`
      <add-new-element-button>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </add-new-element-button>
    `);
  });
});
