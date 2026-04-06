import { LitElement, html, css } from "lit";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";

export class SlideArrow extends DDDSuper(LitElement) {
  static get tag() {
    return "slide-arrow";
  }

  static get properties() {
    return {
      ...super.properties,
      direction: { type: String },
      disabled: { type: Boolean, reflect: true },
    };
  }

  constructor() {
    super();
    this.direction = "left";
    this.disabled = false;
  }

  static get styles() {
    return [
      super.styles,
      css`
        :host {
          display: inline-flex;
        }

        button {
          width: 42px;
          height: 42px;
          border-radius: var(--ddd-radius-circle);
          border: var(--ddd-border-sm);
          border-color: var(--ddd-theme-default-skyBlue);
          background: var(--ddd-theme-default-white);
          color: var(--ddd-theme-default-skyBlue);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: var(--ddd-spacing-0);
          box-sizing: border-box;
          font: inherit;
        }

        button:hover,
        button:focus-visible {
          background: var(--ddd-accent-0);
        }

        button:disabled {
          opacity: 0.45;
          cursor: not-allowed;
        }

        .arrow {
          font-size: var(--ddd-font-size-ml);
          line-height: 1;
          font-weight: var(--ddd-font-weight-bold);
        }
      `,
    ];
  }

  _activate() {
    if (this.disabled) return;

    this.dispatchEvent(
      new CustomEvent("play-list-arrow", {
        bubbles: true,
        composed: true,
        detail: { direction: this.direction },
      })
    );
  }

  render() {
    const isLeft = this.direction === "left";

    return html`
      <button
        ?disabled=${this.disabled}
        @click=${this._activate}
        aria-label=${isLeft ? "Previous slide" : "Next slide"}
      >
        <span class="arrow">${isLeft ? "‹" : "›"}</span>
      </button>
    `;
  }
}

globalThis.customElements.define(SlideArrow.tag, SlideArrow);