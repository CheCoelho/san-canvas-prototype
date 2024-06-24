import { Component, h, Prop } from '@stencil/core';
import { NodeData } from '../node-editor/node-editor-component';

@Component({
  tag: 'node-overview',
  styleUrl: 'node-overview.css',
  scoped: true,
})
export class NodeOverview {
  @Prop() node: NodeData;

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
          <strong>name:</strong> {this.node.nodeName ? this.node.nodeName : <i>Unscaffolded Node</i>}
        </p>
        <p>
          <strong>Functional Description:</strong> {this.node.functionalDescription ? this.node.functionalDescription : <i>No description</i>}
        </p>
        <p>
          <strong>Return Type Description:</strong> {this.node.returnTypeDescription ? this.node.returnTypeDescription : <i>No description</i>}
        </p>
        <p>
          <strong>Inputs:</strong> {this.node.inputs.join(', ')}
        </p>
        <p>
          <strong>Outputs:</strong> {this.node.outputs.join(', ')}
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
