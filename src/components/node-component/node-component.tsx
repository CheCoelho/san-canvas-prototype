import { Component, h, Prop, State, Element } from '@stencil/core';
import { NodeComponentProps } from '../node-editor/node-editor-component';

@Component({
  tag: 'node-component',
  styleUrl: 'node-component.css',
  scoped: true,
})
export class NodeComponent {
  @Element() el: HTMLElement;
  @Prop() nodeId: string;
  @Prop() inputs: string[]; // Receive inputs as a prop
  @Prop() outputs: string[]; // Receive output as a prop
  @Prop() name: string;
  @Prop() functionalDescription: string;
  @Prop() returnTypeDescription: string;
  @Prop() scaffolded: boolean;
  @Prop() outputClick: (event: MouseEvent) => void;
  @Prop() inputClick: (event: MouseEvent) => void;
  @Prop() scaffold: (nodeId: string, nodeName: string, functionalDescription: string, returnTypeDescription: string) => void;
  @Prop() nodeComponentProps: NodeComponentProps;

  @State() tempNodeName: string;
  @State() tempFunctionalDescription: string;
  @State() tempReturnTypeDescription: string;

  componentWillLoad() {
    this.tempNodeName = this.name || '';
    this.tempFunctionalDescription = this.functionalDescription || '';
    this.tempReturnTypeDescription = this.returnTypeDescription || '';
  }

  handleScaffold() {
    this.scaffold(this.nodeId, this.tempNodeName, this.tempFunctionalDescription, this.tempReturnTypeDescription);
  }

  render() {
    return (
      <div class="node" id={this.nodeId} style={{ width: `${this.nodeComponentProps.nodeWidth}px`, height: `${this.nodeComponentProps.nodeHeight}px` }}>
        <div class="inputs" style={{ top: `${this.nodeComponentProps.portOffsetY}px` }}>
          <div class="input-port" key={-1} onClick={event => this.inputClick(event)}>
            <svg height="20" width="20">
              <circle cx="10" cy="10" r="5" fill="blue" />
            </svg>
          </div>
          {this.inputs.map(input => (
            <div class="input-port" key={input} onClick={event => this.inputClick(event)}>
              <svg height="20" width="20">
                <circle cx="10" cy="10" r="5" fill="blue" />
              </svg>
            </div>
          ))}
        </div>
        <div class="node-header">{this.scaffolded ? this.name : 'Unscaffolded Node'}</div>
        {!this.scaffolded && (
          <div class="form">
            <label>
              Name:
              <input type="text" value={this.tempNodeName} onInput={event => (this.tempNodeName = (event.target as HTMLInputElement).value)} />
            </label>
            <label>
              Description:
              <textarea value={this.tempFunctionalDescription} onInput={event => (this.tempFunctionalDescription = (event.target as HTMLTextAreaElement).value)}></textarea>
            </label>
            <label>
              Return Type:
              <textarea value={this.tempReturnTypeDescription} onInput={event => (this.tempReturnTypeDescription = (event.target as HTMLTextAreaElement).value)}></textarea>
            </label>
            <button onClick={() => this.handleScaffold()}>Scaffold</button>
          </div>
        )}
        {this.scaffolded && (
          <div class="button-group">
            <button>upload</button>
          </div>
        )}
        <div class="outputs" style={{ top: `${this.nodeComponentProps.portOffsetY}px` }}>
          <div class="output-port" id={`output-${this.nodeId}`} onClick={event => this.outputClick(event)}>
            <svg height="20" width="20">
              <circle cx="10" cy="10" r="5" fill="red" />
            </svg>
          </div>
        </div>
      </div>
    );
  }
}
