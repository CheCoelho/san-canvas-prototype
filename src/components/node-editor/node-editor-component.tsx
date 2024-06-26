import { Component, h, State, Element, Host } from '@stencil/core';
import * as d3 from 'd3';
import { v4 as uuidv4 } from 'uuid';
import { createExpressApiClient } from '../../client/client';

export interface NodeData {
  id: string;
  x: number;
  y: number;
  inputs: string[];
  outputs: string[];
  nodeName: string;
  functionalDescription: string;
  returnTypeDescription: string;
  scaffolded: boolean;
  port: number;
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
  nodesGroup: any;
  connectionsGroup: any;

  nodeComponentProps: NodeComponentProps = {
    nodeWidth: 200,
    nodeHeight: 100,
    portOffsetX: 10,
    portOffsetY: 20,
  };

  componentDidLoad() {
    this.svg = d3
      .select(this.el.querySelector('.nodes-container'))
      .append('svg')
      .attr('width', '100%')
      .attr('height', '100%')
      .style('position', 'absolute')
      .style('top', '0')
      .style('left', '0');

    this.connectionsGroup = this.svg.append('g').attr('class', 'connections');
    this.nodesGroup = this.svg.append('g').attr('class', 'nodes');
  }

  componentDidUpdate() {
    this.nodes.forEach(node => {
      const nodeElement = this.el.querySelector(`#node-${node.id}`);
      if (nodeElement) {
        this.initializeDrag(node, nodeElement as HTMLElement);
      }
    });
  }

  outPutClick = (nodeId: string) => {
    const node = this.nodes.find(n => n.id === nodeId);
    if (node) {
      if (this.selectedInputNode) {
        this.addConnection(node, this.selectedInputNode);
        this.selectedInputNode = null;
      } else {
        this.selectedOutputNode = node;
      }
      console.log('Output clicked', node.id);
    }
  };

  inputClick = (nodeId: string) => {
    const node = this.nodes.find(n => n.id === nodeId);
    if (node) {
      if (this.selectedOutputNode) {
        this.addConnection(this.selectedOutputNode, node);
        this.selectedOutputNode = null;
      } else {
        this.selectedInputNode = node;
      }
      console.log('Input clicked', node.id);
    }
  };

  addConnection(outputNode: NodeData, inputNode: NodeData) {
    const inputNodeIndex = this.nodes.findIndex(node => node.id === inputNode.id);
    if (inputNodeIndex !== -1) {
      this.nodes[inputNodeIndex].inputs.push(outputNode.id);
    }

    const outputNodeIndex = this.nodes.findIndex(node => node.id === outputNode.id);
    if (outputNodeIndex !== -1) {
      this.nodes[outputNodeIndex].outputs.push(inputNode.id);
    }

    this.connections = [...this.connections, { from: outputNode, to: inputNode }];
    this.updateConnections();
  }

  updateConnections() {
    const lines = this.connectionsGroup.selectAll('line').data(this.connections);

    lines
      .enter()
      .append('line')
      .attr('stroke', 'grey')
      .attr('stroke-width', 2)
      .merge(lines)
      .attr('x1', d => d.from.x + this.nodeComponentProps.nodeWidth - 3 * this.nodeComponentProps.portOffsetX)
      .attr('y1', d => d.from.y + this.nodeComponentProps.portOffsetY)
      .attr('x2', d => d.to.x)
      .attr('y2', d => d.to.y + this.nodeComponentProps.portOffsetY);

    lines.exit().remove();
  }

  selectNode(node: NodeData) {
    this.selectedNode = { ...node };
  }

  handleScaffold = (nodeId: string, nodeName: string, functionalDescription: string, returnTypeDescription: string) => {
    const expressApi = createExpressApiClient();
    // where the inputs are the return tpyes for the ids of the connected nodes
    const argInputs = this.nodes.find(node => node.id === nodeId)?.inputs || [];

    const args = argInputs.map(inputId => {
      const connectedNode = this.nodes.find(node => node.id === inputId);
      return {
        id: inputId,
        type: connectedNode?.returnTypeDescription || '',
      };
    });

    const port = this.nodes.find(node => node.id === nodeId).port || 1;
    expressApi.callExpressApi('/api/scaffold', { nodeId, nodeName, functionalDescription, returnTypeDescription, args, port });
    this.nodes = this.nodes.map(node => (node.id === nodeId ? { ...node, nodeName, functionalDescription, returnTypeDescription, scaffolded: true } : node));
  };

  addNode() {
    const newNode: NodeData = {
      id: uuidv4(),
      x: 100 + (this.nodes.length % 10) * 220,
      y: 50 + Math.floor(this.nodes.length / 10) * 120,
      inputs: [],
      outputs: [],
      nodeName: '',
      functionalDescription: '',
      returnTypeDescription: '',
      scaffolded: false,
      port: 5000 + 1 + this.nodes.length,
    };
    this.nodes = [...this.nodes, newNode];
  }
  stopApps() {
    const expressApi = createExpressApiClient();
    expressApi.callExpressApi('/api/stop-apps', { ports: this.nodes.map(node => node.port) });
  }

  removeNodes() {
    const expressApi = createExpressApiClient();
    expressApi.callExpressApi('/api/remove-apps', { ports: this.nodes.map(node => node.port), nodeIds: this.nodes.map(node => node.id) });
    this.removeNodeData();
  }

  removeNodeData() {
    this.nodes = [];
    this.selectedNode = null;
    this.selectedOutputNode = null;
    this.selectedInputNode = null;
    this.connections = [];
  }

  initializeDrag(node: NodeData, nodeElement: HTMLElement) {
    const d3Node = d3.select(nodeElement);
    if (!d3Node.node()) {
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
        .on('start', () => {
          this.selectNode(node); // Set as the selected node when drag starts
          d3.select(nodeElement).raise().classed('active', true);
        })
        .on('drag', event => {
          const dx = event.x;
          const dy = event.y;
          d3.select(nodeElement).style('transform', `translate(${dx}px, ${dy}px)`);
          node.x = dx;
          node.y = dy;
          updateSelectedNode();
          this.updateConnections();
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
          <button onClick={() => this.stopApps()}>Stop Nodes</button>
          <button onClick={() => this.removeNodes()}>Remove Nodes</button>
        </div>
        <div class="nodes-container" style={{ position: 'relative', width: '100%', height: '100vh' }}>
          {this.nodes.map(node => (
            <div key={node.id} id={`node-${node.id}`} class="node-wrapper" style={{ position: 'absolute', transform: `translate(${node.x}px, ${node.y}px)` }}>
              <node-component
                nodeId={node.id}
                nodes={this.nodes}
                inputs={node.inputs}
                outputs={node.outputs}
                name={node.nodeName}
                functionalDescription={node.functionalDescription}
                returnTypeDescription={node.returnTypeDescription}
                scaffolded={node.scaffolded}
                scaffold={this.handleScaffold}
                outputClick={this.outPutClick}
                inputClick={this.inputClick}
                nodeComponentProps={this.nodeComponentProps}
              />
            </div>
          ))}
        </div>
        <node-overview node={this.selectedNode}></node-overview>
      </Host>
    );
  }
}
