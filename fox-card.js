import { LitElement, html, css } from "lit";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";

export class FoxCard extends DDDSuper(LitElement) {
  static get tag() {
    return "fox-card";
  }

  static get properties() {
    return {
      ...super.properties,
      username: { type: String },
      profileImage: { type: String, attribute: "profile-image" },
      image: { type: String },
      caption: { type: String },
      dateTaken: { type: String, attribute: "date-taken" },
      alt: { type: String },
      liked: { type: Boolean, reflect: true },
      shareLink: { type: String, attribute: "share-link" }
    };
  }

  constructor() {
    super();
    this.username = "";
    this.profileImage = "";
    this.image = "";
    this.caption = "";
    this.dateTaken = "";
    this.alt = "";
    this.liked = false;
    this.shareLink = "";
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
        }

        .card {
          background: white;
          border-radius: 22px;
          overflow: hidden;
          min-height: 620px;
          display: flex;
          flex-direction: column;
          box-sizing: border-box;
        }

        .header {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px 18px;
          color: #111;
          font-weight: 700;
        }

        .avatar {
          width: 42px;
          height: 42px;
          border-radius: 50%;
          object-fit: cover;
          background: #d9d9d9;
          flex: 0 0 auto;
        }

        .username {
          font-size: 1rem;
          font-weight: 700;
        }

        .image-wrap {
          padding: 0 18px;
        }

        .post-image {
          width: 100%;
          height: 360px;
          object-fit: cover;
          display: block;
          border-radius: 14px;
          background: #e5e5e5;
        }

        .content {
          padding: 14px 18px 18px 18px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          color: #111;
        }

        .actions {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .heart-btn {
          border: none;
          background: transparent;
          padding: 0;
          cursor: pointer;
          line-height: 1;
        }

        .heart {
          color: #c2185b;
          font-size: 2.3rem;
          line-height: 1;
          display: inline-block;
        }

        .share-link {
          font-size: 1rem;
          color: #1d70b8;
          text-decoration: none;
          font-weight: 600;
          line-height: 1;
        }

        .caption {
          font-size: 1rem;
          line-height: 1.45;
        }

        .date {
          font-size: 0.92rem;
          color: #666;
        }

        @media (max-width: 700px) {
          .card {
            min-height: 560px;
          }

          .post-image {
            height: 280px;
          }
        }

        @media (prefers-color-scheme: dark) {
  .card {
    background: #181a1f;
  }

  .header,
  .content,
  .username,
  .caption {
    color: #f5f5f5;
  }

  .date {
    color: #c7c7c7;
  }

  .share-link {
    color: #76b7ff;
  }
}
      `
    ];
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

  render() {
    return html`
      <div class="card">
        <div class="header">
          <img
            class="avatar"
            src="${this.profileImage}"
            alt="${this.username} profile picture"
          />
          <div class="username">${this.username}</div>
        </div>

        <div class="image-wrap">
          <img class="post-image" src="${this.image}" alt="${this.alt}" />
        </div>

        <div class="content">
          <div class="actions">
            <button
              class="heart-btn"
              @click=${this._toggleLike}
              aria-label="Like post"
            >
              <span class="heart">${this.liked ? "♥" : "♡"}</span>
            </button>

            <a
              class="share-link"
              href="${this.shareLink}"
              target="_blank"
              rel="noopener noreferrer"
            >
              Share
            </a>
          </div>

          <div class="caption">${this.caption}</div>
          <div class="date">${this.dateTaken}</div>
        </div>
      </div>
    `;
  }
}

globalThis.customElements.define(FoxCard.tag, FoxCard);