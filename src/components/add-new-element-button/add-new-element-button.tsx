import { Component, Prop, h } from '@stencil/core';

@Component({
  tag: 'add-new-element-button',
  styleUrl: 'add-new-element-button.css',
  scoped: true,
})
export class AddNewElementButton {

  @Prop() buttonName: string;
  @Prop() activeFunction: (input:string|boolean) => void;
  @Prop() inputFunctionOne:string|boolean

  handleClick() {
    this.activeFunction(this.inputFunctionOne);
  }


  render() {
    return (
      <button class='new-content' onClick={()=>this.handleClick()}>
        {this.buttonName}
      </button>
    );
  }
}
