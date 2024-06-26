import { Component, h, Prop, State, Element } from '@stencil/core';
import { NodeComponentProps, NodeData } from '../node-editor/node-editor-component';

@Component({
  tag: 'node-component',
  styleUrl: 'node-component.css',
  scoped: true,
})
export class NodeComponent {
  @Element() el: HTMLElement;
  @Prop() nodeId: string;
  @Prop() nodes: NodeData[];
  @Prop() inputs: string[];
  @Prop() outputs: string[];
  @Prop() name: string;
  @Prop() functionalDescription: string;
  @Prop() returnTypeDescription: string;
  @Prop() scaffolded: boolean;
  @Prop() outputClick: (nodeId: string) => void;
  @Prop() inputClick: (nodeId: string) => void;
  @Prop() scaffold: (nodeId: string, nodeName: string, functionalDescription: string, returnTypeDescription: string) => void;
  @Prop() nodeComponentProps: NodeComponentProps;

  @State() tempNodeName: string;
  @State() tempFunctionalDescription: string;
  @State() tempReturnTypeDescription: string;
  @State() isEditing: boolean = false;
  flaskApi: any;
  expressApi: any;

  componentWillLoad() {
    this.tempNodeName = this.name || '';
    this.tempFunctionalDescription = this.functionalDescription || '';
    this.tempReturnTypeDescription = this.returnTypeDescription || '';
  }

  handleScaffold() {
    this.scaffold(this.nodeId, this.tempNodeName, this.tempFunctionalDescription, this.tempReturnTypeDescription);
    this.isEditing = false; // Exit edit mode after scaffolding
  }

  setEditing() {
    this.isEditing = !this.isEditing;
  }

  render() {
    const inputPorts = [...this.inputs, ''];

    return (
      <div class="node" id={this.nodeId}>
        <div class="inputs">
          {inputPorts.map((_, index) => (
            <div
              class="input-port"
              key={index}
              onClick={event => {
                event.stopPropagation();
                this.inputClick(this.nodeId);
              }}
              style={{ top: `${index * this.nodeComponentProps.portOffsetY}px` }}
            >
              <svg height="20" width="20">
                <circle cx="10" cy="10" r="6" fill="grey" />
              </svg>
            </div>
          ))}
        </div>
        <div class="node-header">{this.scaffolded ? this.name : 'Unscaffolded Node'}</div>
        {this.isEditing && (
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
        <div class="button-group">
          {this.scaffolded && <button>upload</button>}
          <button onClick={() => this.setEditing()}>{this.isEditing ? 'Close' : 'Edit'}</button>
        </div>
        <div class="outputs">
          <div
            class="output-port"
            onClick={event => {
              event.stopPropagation();
              this.outputClick(this.nodeId);
            }}
          >
            <svg height="20" width="20">
              <circle cx="10" cy="10" r="6" fill="grey" />
            </svg>
          </div>
        </div>
      </div>
    );
  }
}
