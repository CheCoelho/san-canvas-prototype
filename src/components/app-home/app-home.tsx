import { Component, h, State } from '@stencil/core';

@Component({
  tag: 'app-home',
  styleUrl: 'app-home.css',
  scoped: true,
})
export class AppHome {
  @State() nodes: any[] = [];

  addNewNode = () => {
    this.nodes = [...this.nodes, { name: 'Node ' + this.nodes.length }];
  };
  render() {
    return (
      <div class="app-home">
        <div>
          <br></br>
          <br></br>
          <br></br>
          <br></br>

          <node-editor-component></node-editor-component>
          {/* <add-new-element-button buttonName={'Add Node'} activeFunction={this.addNewNode}>
            {' '}
          </add-new-element-button> */}
        </div>
      </div>
    );
  }
}
