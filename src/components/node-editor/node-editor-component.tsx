import { Component, h, State, Element, Host, Method } from '@stencil/core';
import * as d3 from 'd3';
import { v4 as uuidv4 } from 'uuid'; // Import uuid

interface NodeData {
  id: string;
  x: number;
  y: number;
  inputs: string[]; // Array of identifiers for each input
  output: string; // Identifier for the output
  nodeName: string;
  functionalDescription: string;
  returnTypeDescription: string;
  scaffolded: boolean; // New property to track if the node is scaffolded
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
  @State() selectedNode: NodeData | null = null;
  @State() selectedOutputNode: NodeData | null = null;
  @State() selectedInputNode: NodeData | null = null;
  @State() connections: Connection[] = [];

  svg: any;

  nodeComponentProps: NodeComponentProps = {
    nodeWidth: 400,
    nodeHeight: 350,
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

  selectNode(node: NodeData) {
    this.selectedNode = { ...node }; // Ensure the selected node state updates correctly
  }

  handleScaffold = (nodeId: string, nodeName: string, functionalDescription: string, returnTypeDescription: string) => {
    this.nodes = this.nodes.map(node => (node.id === nodeId ? { ...node, nodeName, functionalDescription, returnTypeDescription, scaffolded: true } : node));
  };

  addNode() {
    const newNode: NodeData = {
      id: uuidv4(), // Generate a unique ID
      x: 100 + (this.nodes.length % 10) * 120,
      y: 50 + Math.floor(this.nodes.length / 10) * 120,
      inputs: ['input1', 'input2'],
      output: 'output',
      nodeName: '',
      functionalDescription: '',
      returnTypeDescription: '',
      scaffolded: false, // Initially unscaffolded
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

    const updateSelectedNode = () => {
      if (this.selectedNode && this.selectedNode.id === node.id) {
        this.selectedNode = { ...node };
      }
    };

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
          updateSelectedNode();
        })
        .on('end', function () {
          d3.select(this).classed('active', false);
        }),
    );
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
              name={node.nodeName}
              functionalDescription={node.functionalDescription}
              returnTypeDescription={node.returnTypeDescription}
              scaffolded={node.scaffolded}
              scaffold={this.handleScaffold}
              outputClick={() => this.outPutClick(node)}
              inputClick={() => this.inputClick(node)}
              onClick={() => this.selectNode(node)}
              style={{ position: 'absolute', transform: `translate(${node.x}px, ${node.y}px)` }}
              ref={el => this.initializeDrag(node, el)}
              nodeComponentProps={this.nodeComponentProps}
            />
          ))}
        </div>
        <node-overview node={this.selectedNode}></node-overview>
      </Host>
    );
  }
}
