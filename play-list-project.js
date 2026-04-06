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
      this._scrollActiveThumbIntoView();
    }
  }

  _updateQueryParam() {
    const currentUrl = new URL(window.location.href);
    currentUrl.searchParams.set("activeIndex", this.index);
    history.replaceState(null, "", currentUrl.toString());
  }

  _scrollActiveThumbIntoView() {
    const activeThumb = this.renderRoot?.querySelector(
      '.thumb-btn[aria-current="true"]'
    );
    if (activeThumb) {
      activeThumb.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest"
      });
    }
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
          background: var(--ddd-primary-4);
          border-radius: var(--ddd-radius-lg);
          padding: var(--ddd-spacing-5) var(--ddd-spacing-5) var(--ddd-spacing-4)
            var(--ddd-spacing-5);
          box-sizing: border-box;
          min-height: 860px;
          position: relative;
        }

        .carousel {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: var(--ddd-spacing-4);
          max-width: 720px;
          margin: 0 auto;
          position: relative;
        }

        .left-arrow,
        .right-arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          z-index: 2;
        }

        .left-arrow {
          left: -20px;
        }

        .right-arrow {
          right: -20px;
        }

        .card-area {
          width: 100%;
          max-width: 640px;
          height: 760px;
          margin: 0 auto;
          flex: 1 1 auto;
        }

        .thumb-row {
          margin-top: var(--ddd-spacing-4);
          display: flex;
          justify-content: flex-start;
          align-items: center;
          gap: var(--ddd-spacing-3);
          flex-wrap: nowrap;
          overflow-x: auto;
          overflow-y: hidden;
          padding: var(--ddd-spacing-0) var(--ddd-spacing-3) var(--ddd-spacing-1)
            var(--ddd-spacing-3);
          scroll-behavior: smooth;
          box-sizing: border-box;
        }

        .thumb-row::-webkit-scrollbar {
          height: var(--ddd-spacing-2);
        }

        .thumb-row::-webkit-scrollbar-thumb {
          background: var(--ddd-theme-default-white65);
          border-radius: var(--ddd-radius-rounded);
        }

        .thumb-row::-webkit-scrollbar-track {
          background: var(--ddd-theme-default-navy40);
          border-radius: var(--ddd-radius-rounded);
        }

        .thumb-btn {
          border: none;
          background: var(--ddd-theme-default-potential0);
          padding: var(--ddd-spacing-0);
          cursor: pointer;
          flex: 0 0 auto;
          border-radius: var(--ddd-radius-md);
        }

        .thumb-btn:focus-visible {
          outline: var(--ddd-border-sm);
          outline-color: var(--ddd-theme-default-skyBlue);
          outline-offset: var(--ddd-spacing-1);
        }

        .thumb {
          width: 58px;
          height: 58px;
          object-fit: cover;
          border-radius: var(--ddd-radius-md);
          display: block;
          border: var(--ddd-border-md);
          border-color: var(--ddd-theme-default-potential0);
          opacity: 0.72;
          background: var(--ddd-accent-2);
        }

        .thumb-btn[aria-current="true"] .thumb {
          border-color: var(--ddd-theme-default-skyBlue);
          opacity: 1;
        }

        .loading {
          color: var(--ddd-theme-default-white);
          min-height: 500px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: var(--ddd-font-size-xxs);
        }

        @media (max-width: 700px) {
          .frame {
            padding: var(--ddd-spacing-3) var(--ddd-spacing-3) var(--ddd-spacing-4)
              var(--ddd-spacing-3);
            border-radius: var(--ddd-radius-xl);
            min-height: 660px;
          }

          .left-arrow {
            left: -6px;
          }

          .right-arrow {
            right: -6px;
          }

          .card-area {
            height: 760px;
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
                <div class="carousel" @play-list-arrow=${this._onArrow}>
                  <slide-arrow
                    class="left-arrow"
                    direction="left"
                    .disabled=${leftDisabled}
                  ></slide-arrow>

                  <div class="card-area">
                    <fox-card
                      .displayName=${currentPost.displayName}
                      .username=${currentPost.username}
                      .memberSince=${currentPost.memberSince}
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

                  <slide-arrow
                    class="right-arrow"
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
                          loading="lazy"
                          decoding="async"
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