import { Component, h, Prop } from '@stencil/core';

@Component({
  tag: 'node-overview',
  styleUrl: 'node-overview.css',
  scoped: true,
})
export class NodeOverview {
  @Prop() node: any;

  render() {
    if (!this.node) {
      return <div class="node-details">Select a node to see details</div>;
    }

    return (
      <div class="node-details">
        <h2>Node Overview</h2>
        <p>
          <strong>ID:</strong> {this.node.id}
        </p>

        <p>
          <strong>Inputs:</strong> {this.node.inputs.join(', ')}
        </p>
        <p>
          <strong>Output:</strong> {this.node.output}
        </p>
        <div class="node-coordinates">
          <p class="coordinate-text">
            <strong>X:</strong> {this.node.x}
          </p>
          <p class="coordinate-text">
            <strong>Y:</strong> {this.node.y}
          </p>
        </div>
      </div>
    );
  }
}
