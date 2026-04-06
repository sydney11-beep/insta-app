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
          color: var(--ddd-primary-2);
          height: 100%;
        }

        .card {
          background: var(--ddd-accent-6);
          border-radius: var(--ddd-radius-xl);
          overflow: hidden;
          display: flex;
          flex-direction: column;
          border: var(--ddd-border-xs);
          box-shadow: var(--ddd-boxShadow-md);
          height: 100%;
          min-height: 0;
        }

        .header {
          display: flex;
          align-items: center;
          gap: var(--ddd-spacing-3);
          padding: var(--ddd-spacing-4);
          background: var(--ddd-accent-6);
          flex: 0 0 auto;
        }

        .avatar {
          width: 44px;
          height: 44px;
          border-radius: var(--ddd-radius-circle);
          object-fit: cover;
          border: var(--ddd-border-sm);
          border-color: var(--ddd-accent-1);
          background: var(--ddd-accent-2);
          flex: 0 0 auto;
        }

        .meta {
          display: flex;
          flex-direction: column;
          min-width: 0;
        }

        .display-name {
          font-size: var(--ddd-font-size-4xs);
          font-weight: var(--ddd-font-weight-bold);
          color: var(--ddd-primary-2);
          line-height: 1.2;
        }

        .username {
          font-size: var(--ddd-font-size-4xs);
          color: var(--ddd-primary-6);
          line-height: 1.2;
        }

        .member-since {
          font-size: 0.8rem;
          color: var(--ddd-primary-6);
          line-height: 1.2;
          margin-top: var(--ddd-spacing-1);
          ;
        }

        .image-wrap {
          width: 100%;
          aspect-ratio: 1 / 1;
          background: var(--ddd-accent-2);
          overflow: hidden;
          flex: 0 0 auto;
        }

        .image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          background: var(--ddd-accent-2);
        }

        .content {
          padding: var(--ddd-spacing-4);
          background: var(--ddd-accent-6);
          display: flex;
          flex-direction: column;
          min-height: 0;
          height: 190px;
          box-sizing: border-box;
          overflow: hidden;
        }

        .actions {
          display: flex;
          gap: var(--ddd-spacing-4);
          align-items: center;
          position: relative;
          margin-bottom: var(--ddd-spacing-3);
          flex: 0 0 auto;
        }

        button {
          border: none;
          background: transparent;
          cursor: pointer;
          padding: var(--ddd-spacing-0);
          font: inherit;
        }

        button:focus-visible {
          outline: 3px solid var(--ddd-theme-default-link);
          outline-offset: 4px;
          border-radius: var(--ddd-radius-sm);
        }

        .heart {
          font-size: 2rem;
          line-height: 1;
          color: var(--ddd-primary-11);
        }

        .share {
          color: var(--ddd-theme-default-link);
          font-weight: var(--ddd-font-weight-bold);
          font-size: 1rem;
        }

        .share:hover,
        .share:focus-visible {
          text-decoration: underline;
        }

        .popup {
          position: absolute;
          top: -36px;
          left: var(--ddd-spacing-12);
          background: var(--ddd-primary-2);
          color: var(--ddd-accent-6);
          padding: 6px 10px;
          border-radius: var(--ddd-radius-rounded);
          font-size: 0.78rem;
          white-space: nowrap;
          box-shadow: var(--ddd-boxShadow-md);
        }

        .text-scroll {
          flex: 1 1 auto;
          min-height: 0;
          overflow-y: auto;
          overflow-x: hidden;
          padding-right: var(--ddd-spacing-2);
          box-sizing: border-box;
        }

        .text-scroll::-webkit-scrollbar {
          width: var(--ddd-spacing-2);
        }

        .text-scroll::-webkit-scrollbar-track {
          background: var(--ddd-theme-default-limestoneLight);
          border-radius: var(--ddd-radius-rounded);
        }

        .text-scroll::-webkit-scrollbar-thumb {
          background: var(--ddd-primary-5);
          border-radius: var(--ddd-radius-rounded);
        }

        .caption {
          font-size: 0.98rem;
          line-height: 1.5;
          color: var(--ddd-primary-2);
          margin-bottom: var(--ddd-spacing-2);
          word-break: break-word;
        }

        .caption-name {
          font-weight: var(--ddd-font-weight-bold);
          margin-right: var(--ddd-spacing-2);
        }

        .date {
          font-size: 0.82rem;
          color: var(--ddd-primary-6);
        }

        @media (max-width: 700px) {
          .header,
          .content {
            padding: var(--ddd-spacing-4);
          }

          .content {
            height: 180px;
          }

          .popup {
            left: var(--ddd-spacing-10);
          }
        }

        @media (prefers-color-scheme: dark) {
          :host {
            color: var(--ddd-accent-6);
          }

          .card {
            background: var(--ddd-primary-3);
            border-color: var(--ddd-primary-4);
            box-shadow: var(--ddd-boxShadow-0);
          }

          .header,
          .content {
            background: var(--ddd-primary-3);
          }

          .avatar {
            border-color: var(--ddd-primary-6);
            background: var(--ddd-primary-4);
          }

          .display-name,
          .caption {
            color: var(--ddd-accent-6);
          }

          .username {
            color: var(--ddd-accent-1);
          }

          .member-since,
          .date {
            color: var(--ddd-theme-default-white65);
          }

          .share {
            color: var(--ddd-primary-0);
          }

          .popup {
            background: var(--ddd-accent-6);
            color: var(--ddd-primary-2);
          }

          .text-scroll::-webkit-scrollbar-track {
            background: var(--ddd-primary-4);
          }

          .text-scroll::-webkit-scrollbar-thumb {
            background: var(--ddd-primary-6);
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
      await navigator.clipboard.writeText(window.location.href);
      this.copied = true;

      if (this._copyTimeout) clearTimeout(this._copyTimeout);

      this._copyTimeout = setTimeout(() => {
        this.copied = false;
      }, 1500);
    } catch (e) {
      console.error("copy failed", e);
    }
  }

  render() {
    const safeDisplayName = this.displayName || "Marvel character";
    const safeUsername = this.username || "unknown.user";
    const imageAlt =
      this.alt || `${safeDisplayName} post image posted by @${safeUsername}`;
    const avatarAlt = `${safeDisplayName} profile image`;

    return html`
      <article class="card" aria-label="Post by ${safeDisplayName}">
        <div class="header">
          <img
            class="avatar"
            src="${this.profileImage}"
            alt="${avatarAlt}"
            loading="lazy"
            decoding="async"
          />
          <div class="meta">
            <div class="display-name">${safeDisplayName}</div>
            <div class="username">@${safeUsername}</div>
            <div class="member-since">Since ${this.memberSince}</div>
          </div>
        </div>

        <div class="image-wrap">
          <img
            class="image"
            src="${this.image}"
            alt="${imageAlt}"
            loading="eager"
            decoding="async"
          />
        </div>

        <div class="content">
          <div class="actions">
            <button
              @click=${this._toggleLike}
              aria-label=${this.liked ? "Unlike post" : "Like post"}
              title=${this.liked ? "Unlike post" : "Like post"}
            >
              <span class="heart" aria-hidden="true">
                ${this.liked ? "♥" : "♡"}
              </span>
            </button>

            <button
              class="share"
              @click=${this._copyLink}
              aria-label="Copy page link to clipboard"
              title="Copy page link"
            >
              Share
            </button>

            ${this.copied
              ? html`<div class="popup" role="status" aria-live="polite">Copied!</div>`
              : ""}
          </div>

          <div class="text-scroll">
            <div class="caption">
              <span class="caption-name">${safeDisplayName}</span>
              <span>${this.caption}</span>
            </div>

            <div class="date">${this.dateTaken}</div>
          </div>
        </div>
      </article>
    `;
  }
}

globalThis.customElements.define(FoxCard.tag, FoxCard);