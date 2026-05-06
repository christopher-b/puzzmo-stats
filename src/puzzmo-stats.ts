import { Task, TaskStatus } from "@lit/task";
import { LitElement, css, html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { formatDate } from "./format.js";
import { getGameIconUrl, getPreferredColorScheme } from "./puzzmo-icons.js";
import { listPuzzmoStreaks, type PuzzmoStreak } from "./puzzmo-streaks.js";

@customElement("puzzmo-stats")
export class PuzzmoStats extends LitElement {
  static styles = css`
    :host {
      --puzzmo-stats-spacing: 1rem;
      --puzzmo-stats-font-size-stat: 2rem;
      --puzzmo-stats-font-display: inherit;
      --puzzmo-stats-text-label: #666;
      --puzzmo-stats-border-color: #d8d8d8;
      --puzzmo-stats-icon-size: 28px;

      display: block;
    }

    .puzzmo-stats ul {
      list-style: none;
      padding: 0;
    }

    .puzzmo-stats h1 {
      position: absolute;
      left: -10000px;
      top: auto;
      width: 1px;
      height: 1px;
      overflow: hidden;
    }

    .puzzmo-stats h2 {
      margin-block: 0;
    }

    .puzzmo-stats header {
      display: flex;
      justify-content: space-between;
      margin-bottom: var(--puzzmo-stats-spacing);
      gap: var(--puzzmo-stats-spacing);
      align-items: center;
    }

    .last-played {
      text-align: right;
      color: var(--puzzmo-stats-text-label);
      margin: 0;
    }

    .puzzmo-stats li:not(:last-child) {
      border-bottom: thin solid var(--puzzmo-stats-border-color);
      padding-bottom: var(--puzzmo-stats-spacing);
      margin-bottom: var(--puzzmo-stats-spacing);
    }

    .puzzmo-stats h2 img {
      display: inline;
      inline-size: var(--puzzmo-stats-icon-size);
      block-size: var(--puzzmo-stats-icon-size);
      vertical-align: middle;
    }

    .puzzmo-stats dl {
      display: flex;
      justify-content: space-between;
      gap: var(--puzzmo-stats-spacing);
      margin: 0;
    }

    .puzzmo-stats dl div {
      display: flex;
      flex-direction: column-reverse;
      text-align: center;
    }

    .puzzmo-stats dt {
      color: var(--puzzmo-stats-text-label);
    }

    .puzzmo-stats dd {
      font-size: var(--puzzmo-stats-font-size-stat);
      font-family: var(--puzzmo-stats-font-display);
      line-height: 0.9;
      margin: 0;
    }
  `;

  @property({ type: String })
  handle = "";

  private readonly streaksTask = new Task<[string], PuzzmoStreak[]>(this, {
    task: async ([handle]) => listPuzzmoStreaks(handle),
    args: () => [this.handle],
  });

  render() {
    const isLoading = this.streaksTask.status === TaskStatus.PENDING;

    return html`
      <article
        class="puzzmo-stats"
        aria-live="polite"
        aria-busy=${isLoading}
        aria-labelledby="puzzmo-stats-heading"
      >
        <h1 id="puzzmo-stats-heading">My Puzzmo Stats</h2>
        ${this.streaksTask.render({
          initial: () => this.renderInitialState(),
          pending: () => this.renderLoadingState(),
          error: (error) => this.renderErrorState(error),
          complete: (streaks) => this.renderStreaks(streaks),
        })}
      </section>
    `;
  }

  private renderInitialState() {
    return this.handle ? nothing : html`<p>Add a handle to load stats.</p>`;
  }

  private renderLoadingState() {
    return html`<p>Loading stats for ${this.handle}...</p>`;
  }

  private renderErrorState(error: unknown) {
    return html`<p>
      Error loading stats for ${this.handle}: ${String(error)}
    </p>`;
  }

  private renderStreaks(streaks: PuzzmoStreak[]) {
    if (streaks.length === 0) {
      return html`<p>No Puzzmo stats found for ${this.handle}.</p>`;
    }

    return html`
      <ul>
        ${streaks.map((streak) => this.renderStreak(streak))}
      </ul>
    `;
  }

  private renderStreak(streak: PuzzmoStreak) {
    const colorScheme = getPreferredColorScheme();
    const styles = getComputedStyle(this);
    const foreground =
      styles.getPropertyValue("--puzzmo-stats-icon-foreground") ||
      colorScheme.foreground;
    const background =
      styles.getPropertyValue("--puzzmo-stats-icon-background") ||
      colorScheme.background;
    const iconUrl = getGameIconUrl({
      slug: streak.gameSlug,
      foreground,
      background,
    });

    return html`
      <li>
        <header>
          <h2>
            <img src=${iconUrl} alt="" width="28" height="28" />
            ${streak.gameDisplayName}
          </h2>
          <p class="last-played">
            Last game
            <time datetime=${streak.lastUpdated}>
              ${formatDate(streak.lastUpdated)}
            </time>
          </p>
        </header>
        <dl>
          <div>
            <dt>Streak</dt>
            <dd>${streak.current}</dd>
          </div>
          <div>
            <dt>Highest Streak</dt>
            <dd>${streak.max}</dd>
          </div>
          <div>
            <dt>Games Played</dt>
            <dd>${streak.total}</dd>
          </div>
        </dl>
      </li>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "puzzmo-stats": PuzzmoStats;
  }
}
