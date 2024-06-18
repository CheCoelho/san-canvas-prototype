import { newSpecPage } from '@stencil/core/testing';
import { NodeComponent } from '../node-component';

describe('node-component', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [NodeComponent],
      html: `<node-component></node-component>`,
    });
    expect(page.root).toEqualHtml(`
      <node-component>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </node-component>
    `);
  });
});
