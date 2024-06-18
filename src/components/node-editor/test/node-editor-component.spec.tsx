import { newSpecPage } from '@stencil/core/testing';
import { NodeEditorComponent } from '../node-editor-component';

describe('node-editor-component', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [NodeEditorComponent],
      html: `<node-editor-component></node-editor-component>`,
    });
    expect(page.root).toEqualHtml(`
      <node-editor-component>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </node-editor-component>
    `);
  });
});
