import { LitElement, html, css } from "lit";

export class FoxCard extends LitElement {
  static get tag() {
    return "fox-card";
  }

  static get properties() {
    return {
      image: { type: String },
      link: { type: String },
      username: { type: String },
      date: { type: String },
    };
  }

  constructor() {
    super();
    this.image = "";
    this.link = "";
    this.username = "fox.account";
    this.date = "3/22/2026";
  }

  static get styles() {
    return css`
      :host {
        display: block;
        width: 100%;
        height: 100%;
      }

      .card {
        background: white;
        border-radius: 10px;
        overflow: hidden;
        height: 100%;
        display: flex;
        flex-direction: column;
      }

      .header {
        display: flex;
        align-items: center;
        padding: 10px;
        font-weight: bold;
      }

      .avatar {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        background: #ccc;
        margin-right: 10px;
      }

      img {
        width: 100%;
        height: 300px;
        object-fit: cover;
      }

      .footer {
        padding: 12px;
      }

      .like {
        font-size: 22px;
      }

      .meta {
        font-size: 14px;
        color: #555;
        margin-top: 6px;
      }
    `;
  }

  render() {
    return html`
      <div class="card">
        <div class="header">
          <div class="avatar"></div>
          ${this.username}
        </div>

        <img src="${this.image}" alt="fox" />

        <div class="footer">
          <div class="like">♡</div>
          <div class="meta">Captain</div>
          <div class="meta">${this.date}</div>
          <div class="meta">user since: 2024</div>
        </div>
      </div>
    `;
  }
}

globalThis.customElements.define(FoxCard.tag, FoxCard);