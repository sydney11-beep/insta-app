import { LitElement, html, css } from "lit";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";

export class PlayListSlide extends DDDSuper(LitElement) {
  static get tag() {
    return "play-list-slide";
  }

  static get properties() {
    return {
      ...super.properties,
      topHeading: { type: String, attribute: "top-heading" },
      secondHeading: { type: String, attribute: "second-heading" },
    };
  }

  constructor() {
    super();
    this.topHeading = "";
    this.secondHeading = "";
  }

  static get styles() {
    return [
      super.styles,
      css`
        :host {
          display: block;
          width: 100%;
          height: 100%;
          box-sizing: border-box;
          background: transparent;
        }

        .card {
          width: 100%;
          height: 100%;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          padding: var(--ddd-spacing-11) var(--ddd-spacing-14)
            var(--ddd-spacing-4) var(--ddd-spacing-14);
          background: transparent;
        }

        .top {
          margin: var(--ddd-spacing-0);
          color: var(--ddd-theme-default-beaverBlue);
          font-size: var(--ddd-font-size-3xs);
          font-weight: var(--ddd-font-weight-bold);
          text-transform: uppercase;
          letter-spacing: 0.02em;
        }

        .title {
          margin: var(--ddd-spacing-2) 0 0 0;
          color: var(--ddd-theme-default-beaverBlue);
          font-size: var(--ddd-font-size-3xl);
          font-weight: var(--ddd-font-weight-bold);
          line-height: 1.05;
          letter-spacing: -0.02em;
          white-space: nowrap;
        }

        .divider {
          width: 70px;
          height: 7px;
          background: var(--ddd-theme-default-pughBlue);
          border-radius: var(--ddd-radius-rounded);
          margin: 36px 0 14px 0;
          display: block;
          flex: 0 0 auto;
        }

        .body {
          width: 72%;
          flex: 1 1 auto;
          min-height: 0;
          overflow-y: auto;
          overflow-x: hidden;
          color: var(--ddd-theme-default-black);
          font-size: var(--ddd-font-size-3xs);
          line-height: 1.35;
          margin-top: var(--ddd-spacing-0);
          padding-right: var(--ddd-spacing-2);
          word-break: break-word;
          overflow-wrap: anywhere;
        }

        .body::-webkit-scrollbar {
          width: 12px;
        }

        .body::-webkit-scrollbar-track {
          background: var(--ddd-theme-default-limestoneLight);
        }

        .body::-webkit-scrollbar-thumb {
          background-color: var(--ddd-theme-default-limestoneGray);
          border-radius: var(--ddd-radius-xl);
          border: var(--ddd-border-md);
        }

        .body ::slotted(*) {
          margin: var(--ddd-spacing-0);
        }

        .body ::slotted(p) {
          margin: var(--ddd-spacing-0);
        }

        @media (max-width: 900px) {
          .card {
            padding: 34px 38px 28px 38px;
          }

          .title {
            max-width: 72%;
          }

          .body {
            width: 78%;
          }
        }

        @media (max-width: 700px) {
          .card {
            padding: 24px 24px 18px 24px;
          }

          .top {
            font-size: var(--ddd-font-size-4xs);
          }

          .title {
            font-size: 2.4rem;
            max-width: 100%;
            margin-top: var(--ddd-spacing-2);
            white-space: normal;
          }

          .divider {
            width: 120px;
            margin: 14px 0 6px 0;
          }

          .body {
            width: 100%;
            font-size: var(--ddd-font-size-4xs);
            line-height: 1.4;
            padding-right: var(--ddd-spacing-2);
          }
        }
      `,
    ];
  }

  render() {
    return html`
      <div class="card">
        <p class="top">${this.topHeading}</p>
        <h2 class="title">${this.secondHeading}</h2>
        <div class="divider"></div>
        <div class="body">
          <slot></slot>
        </div>
      </div>
    `;
  }
}

globalThis.customElements.define(PlayListSlide.tag, PlayListSlide);