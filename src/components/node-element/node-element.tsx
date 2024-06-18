import { Component, Host, h } from '@stencil/core';

@Component({
  tag: 'node-element',
  styleUrl: 'node-element.css',
  shadow: true,
})
export class NodeElement {

  render() {
    return (
      <Host>
        <slot></slot>
      </Host>
    );
  }

}
