/**
 * Copyright 2026 Sydney Anne Reiter
 * @license Apache-2.0, see LICENSE for full text.
 */
import { LitElement, html, css } from "lit";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";

import "./slide-arrow.js";
import "./fox-card.js";

export class PlayListProject extends DDDSuper(LitElement) {
  static get tag() {
    return "play-list-project";
  }

  static get properties() {
    return {
      ...super.properties,
      index: { type: Number, reflect: true },
      posts: { type: Array, state: true },
      slideCount: { type: Number, state: true },
      wrap: { type: Boolean }
    };
  }

  constructor() {
  super();
  this.index = 0;
  this.posts = [];
  this.slideCount = 0;
  this.wrap = true;

  const params = new URLSearchParams(window.location.search);
  const activeIndex = Number(params.get("activeIndex"));

  if (!Number.isNaN(activeIndex) && activeIndex >= 0) {
    this.index = activeIndex;
  }
}

updated(changedProperties) {
  if (changedProperties.has("index")) {
    this._updateQueryParam();
  }
}

_updateQueryParam() {
  const currentUrl = new URL(window.location.href);
  currentUrl.searchParams.set("activeIndex", this.index);
  history.pushState(null, "", currentUrl.toString());
}

  static get styles() {
    return [
      super.styles,
      css`
        :host {
          display: block;
          width: 100%;
          max-width: 920px;
          margin: 0 auto;
          position: relative;
          box-sizing: border-box;
        }

        .shell {
          position: relative;
          width: 100%;
        }

        .frame {
          background: #2c2f36;
          border-radius: 28px;
          padding: 22px 22px 18px 22px;
          box-sizing: border-box;
          min-height: 760px;
          position: relative;
        }

        .card-area {
          width: 100%;
          max-width: 640px;
          margin: 0 auto;
        }

        .thumb-row {
          margin-top: 16px;
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 10px;
          flex-wrap: nowrap;
          overflow-x: auto;
          padding-bottom: 6px;
        }

        .thumb-row::-webkit-scrollbar {
          height: 8px;
        }

        .thumb-row::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.25);
          border-radius: 999px;
        }

        .thumb-btn {
          border: 0;
          background: transparent;
          padding: 0;
          cursor: pointer;
          flex: 0 0 auto;
          border-radius: 12px;
        }

        .thumb {
          width: 58px;
          height: 58px;
          object-fit: cover;
          border-radius: 12px;
          display: block;
          border: 3px solid transparent;
          opacity: 0.72;
        }

        .thumb-btn[aria-current="true"] .thumb {
          border-color: #1d9bf0;
          opacity: 1;
        }

        .arrow-row {
          margin-top: 14px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          max-width: 640px;
          margin-left: auto;
          margin-right: auto;
        }

        .loading {
          color: white;
          min-height: 500px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.1rem;
        }

        @media (max-width: 700px) {
          .frame {
            padding: 14px 14px 16px 14px;
            border-radius: 18px;
            min-height: 660px;
          }

          .thumb {
            width: 48px;
            height: 48px;
          }
        }
      `
    ];
  }

  async firstUpdated() {
    await this.loadPosts();
  }

  async loadPosts() {
   
    try {
      const response = await fetch(new URL("./data.json", import.meta.url).href);
      const data = await response.json();

      const savedLikes =
        JSON.parse(localStorage.getItem("insta-app-likes")) || {};

      this.posts = data.posts.map((post) => ({
        ...post,
        liked:
          typeof savedLikes[post.id] === "boolean"
            ? savedLikes[post.id]
            : false
      }));

      this.slideCount = this.posts.length;

       if (this.index > this.slideCount - 1) {
  this.index = 0;
}
    } catch (error) {
      console.error("Could not load posts:", error);
    }
  }

  _saveLikes() {
    const likesObject = {};
    this.posts.forEach((post) => {
      likesObject[post.id] = post.liked;
    });
    localStorage.setItem("insta-app-likes", JSON.stringify(likesObject));
  }

  _goTo(i) {
    if (this.slideCount === 0) return;
    this.index = Math.max(0, Math.min(i, this.slideCount - 1));
  }

  _goNext() {
    if (this.slideCount === 0) return;
    this.index = this.wrap
      ? (this.index + 1) % this.slideCount
      : Math.min(this.index + 1, this.slideCount - 1);
  }

  _goPrev() {
    if (this.slideCount === 0) return;
    this.index = this.wrap
      ? (this.index - 1 + this.slideCount) % this.slideCount
      : Math.max(this.index - 1, 0);
  }

  _onArrow(e) {
    if (e.detail.direction === "left") {
      this._goPrev();
    } else {
      this._goNext();
    }
  }

  _onLikeChanged(e) {
    const updatedPosts = [...this.posts];
    updatedPosts[this.index] = {
      ...updatedPosts[this.index],
      liked: e.detail.liked
    };
    this.posts = updatedPosts;
    this._saveLikes();
  }

  render() {
    const currentPost = this.posts[this.index];
    const leftDisabled = !this.wrap && this.index === 0;
    const rightDisabled = !this.wrap && this.index === this.slideCount - 1;

    return html`
      <div class="shell">
        <div class="frame">
          ${currentPost
            ? html`
                <div class="card-area">
                  <fox-card
                    .username=${currentPost.username}
                    .profileImage=${currentPost.profileImage}
                    .image=${currentPost.image}
                    .caption=${currentPost.caption}
                    .dateTaken=${currentPost.dateTaken}
                    .alt=${currentPost.alt}
                    .liked=${currentPost.liked}
                    .shareLink=${currentPost.shareLink}
                    @like-changed=${this._onLikeChanged}
                  ></fox-card>
                </div>

                <div class="arrow-row" @play-list-arrow=${this._onArrow}>
                  <slide-arrow
                    direction="left"
                    .disabled=${leftDisabled}
                  ></slide-arrow>

                  <slide-arrow
                    direction="right"
                    .disabled=${rightDisabled}
                  ></slide-arrow>
                </div>

                <div class="thumb-row">
                  ${this.posts.map(
                    (post, i) => html`
                      <button
                        class="thumb-btn"
                        @click=${() => this._goTo(i)}
                        aria-label="Go to post ${i + 1}"
                        aria-current="${i === this.index ? "true" : "false"}"
                      >
                        <img
                          class="thumb"
                          src="${post.thumbnail || post.image}"
                          alt="${post.alt}"
                        />
                      </button>
                    `
                  )}
                </div>
              `
            : html`<div class="loading">loading posts...</div>`}
        </div>
      </div>
    `;
  }
}

globalThis.customElements.define(PlayListProject.tag, PlayListProject);