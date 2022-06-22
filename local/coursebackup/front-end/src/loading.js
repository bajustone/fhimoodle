import { LitElement, html, css, unsafeCSS } from "lit-element";
export default class LoadingElt extends LitElement{
  static styles = css`
  `;
  render(){
      return html`
      <a>Loading....</a>
      `;
  }
  static get styles(){
      return css`${unsafeCSS(style)}`;
  }
}