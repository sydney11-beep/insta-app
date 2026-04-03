import { LitElement, html, css } from "lit";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";

export class FoxCard extends DDDSuper(LitElement) {
  static get tag() {
    return "fox-card";
  }

  static get properties() {
    return {
      ...super.properties,
      displayName: { type: String, attribute: "display-name" },
      username: { type: String },
      memberSince: { type: String, attribute: "member-since" },
      profileImage: { type: String, attribute: "profile-image" },
      image: { type: String },
      caption: { type: String },
      dateTaken: { type: String, attribute: "date-taken" },
      alt: { type: String },
      liked: { type: Boolean, reflect: true },
      shareLink: { type: String, attribute: "share-link" },
      copied: { type: Boolean, state: true }
    };
  }

  constructor() {
    super();
    this.displayName = "";
    this.username = "";
    this.memberSince = "";
    this.profileImage = "";
    this.image = "";
    this.caption = "";
    this.dateTaken = "";
    this.alt = "";
    this.liked = false;
    this.shareLink = "";
    this.copied = false;
    this._copyTimeout = null;
  }

  static get styles() {
    return [
      super.styles,
      css`
        :host {
          display: block;
        }

        .card {
          background: white;
          border-radius: 20px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }

        .header {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px;
        }

        .avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          object-fit: cover;
        }

        .meta {
          display: flex;
          flex-direction: column;
        }

        .display-name {
          font-weight: 700;
        }

        .username {
          font-size: 0.85rem;
          color: #666;
        }

        .image {
          width: 100%;
          height: 320px;
          object-fit: cover;
        }

        .content {
          padding: 14px;
        }

        .actions {
          display: flex;
          gap: 14px;
          align-items: center;
          position: relative;
        }

        button {
          border: none;
          background: none;
          cursor: pointer;
        }

        .heart {
          font-size: 1.8rem;
          color: #e11d48;
        }

        .share {
          color: #1d70b8;
          font-weight: 600;
        }

        .popup {
          position: absolute;
          top: -30px;
          left: 40px;
          background: black;
          color: white;
          padding: 5px 10px;
          border-radius: 8px;
          font-size: 0.75rem;
        }

        .caption {
          margin-top: 8px;
        }

        .date {
          font-size: 0.85rem;
          color: #666;
        }

        @media (prefers-color-scheme: dark) {
          .card {
            background: #181a1f;
            color: white;
          }

          .username,
          .date {
            color: #bbb;
          }

          .popup {
            background: white;
            color: black;
          }
        }
      `
    ];
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this._copyTimeout) {
      clearTimeout(this._copyTimeout);
    }
  }

  _toggleLike() {
    this.liked = !this.liked;

    this.dispatchEvent(
      new CustomEvent("like-changed", {
        bubbles: true,
        composed: true,
        detail: { liked: this.liked }
      })
    );
  }

  async _copyLink() {
    try {
      await navigator.clipboard.writeText(this.shareLink);
      this.copied = true;

      if (this._copyTimeout) clearTimeout(this._copyTimeout);

      this._copyTimeout = setTimeout(() => {
        this.copied = false;
      }, 1500);
    } catch (e) {
      console.error("copy failed");
    }
  }

  render() {
    return html`
      <div class="card">
        <div class="header">
          <img class="avatar" src="${this.profileImage}" />
          <div class="meta">
            <div class="display-name">${this.displayName}</div>
            <div class="username">@${this.username}</div>
            <div class="date">Since ${this.memberSince}</div>
          </div>
        </div>

        <img
          class="image"
          src="${this.image}"
          alt="${this.alt}"
          loading="lazy"
        />

        <div class="content">
          <div class="actions">
            <button @click=${this._toggleLike}>
              <span class="heart">${this.liked ? "♥" : "♡"}</span>
            </button>

            <button class="share" @click=${this._copyLink}>
              Share
            </button>

            ${this.copied
              ? html`<div class="popup">Copied!</div>`
              : ""}
          </div>

          <div class="caption">${this.caption}</div>
          <div class="date">${this.dateTaken}</div>
        </div>
      </div>
    `;
  }
}

globalThis.customElements.define(FoxCard.tag, FoxCard);