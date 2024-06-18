// node-component.tsx

import { Component, h, Prop, Element } from '@stencil/core';

@Component({
  tag: 'node-component',
  styleUrl: 'node-component.css',
  scoped: true,
})
export class NodeComponent {
  @Element() el: HTMLElement;
  @Prop() nodeId: string;
  @Prop() inputs: string[]; // Receive inputs as a prop
  @Prop() output: string; // Receive output as a prop

  render() {
    return (
      <div class="node" id={this.nodeId}>
        <div class="node-header">{this.nodeId}</div>
        <div class="node-body">
          <div class="inputs">
            {this.inputs.map(input => (
              <div class="input-port" key={input}>
                <svg height="20" width="20">
                  <circle cx="10" cy="10" r="5" fill="blue" />
                </svg>
              </div>
            ))}
          </div>
          <div class="outputs">
            <div class="output-port" id={`output-${this.nodeId}`}>
              <svg height="20" width="20">
                <circle cx="10" cy="10" r="5" fill="red" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
