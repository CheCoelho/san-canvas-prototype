import { Component, h, State, Element, Host, Method } from '@stencil/core';
import * as d3 from 'd3';

interface NodeData {
  id: string;
  x: number;
  y: number;
  inputs: string[]; // Array of identifiers for each input
  output: string; // Identifier for the output
}

interface Connection {
  from: NodeData;
  to: NodeData;
}

export interface NodeComponentProps {
  nodeWidth: number;
  nodeHeight: number;
  portOffsetX: number;
  portOffsetY: number;
}

@Component({
  tag: 'node-editor-component',
  styleUrl: 'node-editor-component.css',
  scoped: true,
})
export class NodeEditorComponent {
  @Element() el: HTMLElement;
  @State() nodes: NodeData[] = [];
  @State() selectedOutputNode: NodeData | null = null;
  @State() selectedInputNode: NodeData | null = null;
  @State() connections: Connection[] = [];

  svg: any;

  nodeComponentProps: NodeComponentProps = {
    nodeWidth: 350,
    nodeHeight: 150,
    portOffsetX: 10, // Offset from the node edge for the ports
    portOffsetY: 75, // Vertical position for the ports (center of the node)
  };

  componentDidLoad() {
    this.svg = d3
      .select(this.el)
      .append('svg')
      .attr('width', 2800) // Fixed width for canvas
      .attr('height', 1600) // Fixed height for canvas
      .style('top', '0')
      .style('left', '0');
  }

  outPutClick = (node: NodeData) => {
    if (this.selectedInputNode) {
      this.addConnection(node, this.selectedInputNode);
      this.selectedInputNode = null;
    } else {
      this.selectedOutputNode = node;
    }
    console.log('Output clicked', node.id);
  };

  inputClick = (node: NodeData) => {
    if (this.selectedOutputNode) {
      this.addConnection(this.selectedOutputNode, node);
      this.selectedOutputNode = null;
    } else {
      this.selectedInputNode = node;
    }
    console.log('Input clicked', node.id);
  };

  addConnection(outputNode: NodeData, inputNode: NodeData) {
    this.connections = [...this.connections, { from: outputNode, to: inputNode }];
    this.updateConnections();
  }

  updateConnections() {
    const lines = this.svg.selectAll('line').data(this.connections);

    lines
      .enter()
      .append('line')
      .attr('stroke', 'black')
      .attr('stroke-width', 2)
      .merge(lines)
      .attr('x1', d => d.from.x + this.nodeComponentProps.nodeWidth - this.nodeComponentProps.portOffsetX) // Adjust based on your node size and positioning
      .attr('y1', d => d.from.y + this.nodeComponentProps.portOffsetY)
      .attr('x2', d => d.to.x + this.nodeComponentProps.portOffsetX)
      .attr('y2', d => d.to.y + this.nodeComponentProps.portOffsetY);

    lines.exit().remove();
  }

  render() {
    return (
      <Host>
        <div class="toolbar">
          <button onClick={() => this.addNode()}>Add Node</button>
        </div>
        <div class="nodes-container">
          {this.nodes.map(node => (
            <node-component
              key={node.id}
              nodeId={node.id}
              inputs={node.inputs}
              output={node.output}
              outputClick={() => this.outPutClick(node)}
              inputClick={() => this.inputClick(node)}
              style={{ position: 'absolute', transform: `translate(${node.x}px, ${node.y}px)` }}
              ref={el => this.initializeDrag(node, el)}
              nodeComponentProps={this.nodeComponentProps}
            />
          ))}
        </div>
      </Host>
    );
  }

  @Method()
  async addNode() {
    const newNode: NodeData = {
      id: `node_${this.nodes.length + 1}`,
      x: 100 + (this.nodes.length % 10) * 120,
      y: 50 + Math.floor(this.nodes.length / 10) * 120,
      inputs: ['input1', 'input2'],
      output: 'output',
    };
    this.nodes = [...this.nodes, newNode];
  }

  initializeDrag(node: NodeData, nodeElement: HTMLElement) {
    console.log('initializeDrag', node.id, nodeElement);
    const d3Node = d3.select(nodeElement);
    if (!d3Node.node()) {
      // Early return if the element is not found
      console.error('Draggable element not found:', node.id);
      return;
    }

    d3Node.datum(node).call(
      d3
        .drag()
        .on('start', function () {
          d3.select(this).raise().classed('active', true);
        })
        .on('drag', event => {
          const dx = event.x;
          const dy = event.y;
          d3.select(nodeElement).style('transform', `translate(${dx}px, ${dy}px)`);
          node.x = dx;
          node.y = dy;
          this.updateConnections();
        })
        .on('end', function () {
          d3.select(this).classed('active', false);
        }),
    );
  }
}
