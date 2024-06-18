// // node-editor-component.tsx
// import { Component, h, State, Element, Host, Method } from '@stencil/core';
// import * as d3 from 'd3';

// interface NodeData {
//   id: string;
//   x: number;
//   y: number;
// }

// @Component({
//   tag: 'node-editor-component',
//   styleUrl: 'node-editor-component.css',
//   scoped: true,
// })
// export class NodeEditorComponent {
//   @Element() el: HTMLElement;
//   @State() nodes: NodeData[] = [];
//   svg: any;

//   componentDidLoad() {
//     this.svg = d3.select(this.el).append('svg').attr('width', '100%').attr('height', '100%').style('position', 'absolute').style('top', '0').style('left', '0');
//   }

//   render() {
//     return (
//       <Host>
//         <div class="toolbar">
//           <button onClick={() => this.addNode()}>Add Node</button>
//         </div>
//         <div class="nodes-container">
//           {this.nodes.map(node => (
//             <node-component
//               key={node.id}
//               nodeId={node.id}
//               style={{ position: 'absolute', transform: `translate(${node.x}px, ${node.y}px)` }}
//               onComponentReady={() => this.initializeDrag(node)}
//             />
//           ))}
//         </div>
//       </Host>
//     );
//   }

//   @Method()
//   async addNode() {
//     const newNode: NodeData = {
//       id: `node_${this.nodes.length + 1}`,
//       x: 100 + (this.nodes.length % 10) * 120,
//       y: 50 + Math.floor(this.nodes.length / 10) * 120,
//     };
//     this.nodes = [...this.nodes, newNode];
//   }

//   initializeDrag(node: NodeData) {
//     setTimeout(() => {
//       const nodeElement = this.el.querySelector(`#${node.id}`);
//       if (nodeElement) {
//         const d3Node = d3.select(nodeElement);
//         d3Node.datum(node).call(
//           d3
//             .drag()
//             .on('start', function (event, d) {
//               d3.select(this).raise().classed('active', true);
//             })
//             .on('drag', function (event, d: NodeData) {
//               d.x = event.x;
//               d.y = event.y;
//               d3.select(this).style('transform', `translate(${d.x}px, ${d.y}px)`);
//             })
//             .on('end', function () {
//               d3.select(this).classed('active', false);
//             }),
//         );
//       }
//     }, 100); // Increased delay to ensure elements are fully rendered
//   }
// }

// node-editor-component.tsx
import { Component, h, State, Element, Host, Method } from '@stencil/core';
import * as d3 from 'd3';

interface NodeData {
  id: string;
  x: number;
  y: number;
  inputs: string[]; // Array of identifiers for each input
  output: string; // Identifier for the output
}

@Component({
  tag: 'node-editor-component',
  styleUrl: 'node-editor-component.css',
  scoped: true,
})
export class NodeEditorComponent {
  @Element() el: HTMLElement;
  @State() nodes: NodeData[] = [];

  svg: any;

  componentDidLoad() {
    this.svg = d3.select(this.el).append('svg').attr('width', '100%').attr('height', '100%').style('top', '0').style('left', '0');
  }

  render() {
    return (
      <Host>
        <div class="toolbar">
          <button onClick={() => this.addReturnode()}>Add Node</button>
        </div>
        <div class="nodes-container">
          {this.nodes.map(node => (
            <node-component
              key={node.id}
              nodeId={node.id}
              inputs={node.inputs}
              output={node.output}
              style={{ position: 'absolute', transform: `translate(${node.x}px, ${node.y}px)` }}
              ref={el => this.initializeDrag(node, el)}
            />
          ))}
        </div>
      </Host>
    );
  }

  @Method()
  async addReturnode() {
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
        .on('drag', function (event) {
          const dx = event.x;
          const dy = event.y;
          d3.select(this).style('transform', `translate(${dx}px, ${dy}px)`);
          node.x = dx;
          node.y = dy;
        })
        .on('end', function () {
          d3.select(this).classed('active', false);
        }),
    );
  }
}
