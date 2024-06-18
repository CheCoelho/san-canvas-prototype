import { newSpecPage } from '@stencil/core/testing';
import { NodeElement } from '../node-element';

describe('node-element', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [NodeElement],
      html: `<node-element></node-element>`,
    });
    expect(page.root).toEqualHtml(`
      <node-element>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </node-element>
    `);
  });
});
