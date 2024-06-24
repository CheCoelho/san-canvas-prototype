import { newSpecPage } from '@stencil/core/testing';
import { NodeOverview } from '../node-overview';

describe('node-overview', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [NodeOverview],
      html: `<node-overview></node-overview>`,
    });
    expect(page.root).toEqualHtml(`
      <node-overview>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </node-overview>
    `);
  });
});
