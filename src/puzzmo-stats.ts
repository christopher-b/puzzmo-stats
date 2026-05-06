import { LitElement, html } from "lit";
import { Task } from "@lit/task";
import { customElement, property } from "lit/decorators.js";
import {
  getAtprotoRecordKey,
  listRecordsForHandle,
  type AtprotoRecord,
} from "./lib/atproto.ts";

type PuzzmoStreakRecord = AtprotoRecord & {
  current?: number;
  gameDisplayName?: string;
  gameSlug?: string;
  lastUpdated: string;
  max?: number;
  syncedAt?: string;
  teamSlug?: string;
  total?: number;
};

const collection = "com.puzzmo.streak";
const recordLimit = 50;
let fg = "";
let bg = "";
const dark = "141620";
const light = "ECECEC";
export function colorScheme() {
  if (
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  ) {
    fg = light;
    bg = dark;
  } else {
    fg = dark;
    bg = light;
  }
}

@customElement("puzzmo-stats")
export class PuzzmoStats extends LitElement {
  @property({ type: String })
  handle = "";

  private _loadingTask = new Task(this, {
    task: async ([handle]) => {
      const { records } = await listRecordsForHandle<PuzzmoStreakRecord>({
        collection,
        handle,
        limit: recordLimit,
      });
      return records
        .filter(({ value }) => value.teamSlug === "puzzmo" && value.gameSlug)
        .sort((a, b) => {
          return (
            (b.value.current ?? 0) - (a.value.current ?? 0) ||
            (b.value.total ?? 0) - (a.value.total ?? 0) ||
            (b.value.max ?? 0) - (a.value.max ?? 0) ||
            getAtprotoRecordKey(a.uri).localeCompare(getAtprotoRecordKey(b.uri))
          );
        })
        .map((item) => item.value);
    },
    args: () => [this.handle],
  });

  formatDate = (date: string): string => {
    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // ?aria-busy=${!loading}
  render() {
    return html`
      <section
        aria-live="polite"
        aria-busy="true"
        aria-labelledby="puzzle-stats-heading"
      >
        <h2 id="puzzle-stats-heading">My Puzzmo Stats</h2>
        ${this._loadingTask.render({
          initial: () => html`<p>Initializing</p>`,
          pending: () => html`<p>Loading stats for ${this.handle}...</p>`,
          error: (error) =>
            html`<p>Error loading stats for ${this.handle}: ${error}</p>`,
          complete: (value) =>
            html` <ul class="puzzmo-stats" data-puzzmo-stats>
              ${value.map((item) => {
                console.log(item);
                return html`
                  <li>
                    <header>
                      <h2>
                        <img
                          src=${`https://api.puzzmo.com/gameIcon?slug=${item.gameSlug}&fg=${fg}&bg=${bg}&size=28`}
                          alt="Game logo"
                        />
                        ${item.gameDisplayName}
                      </h2>
                      <p>
                        Last game
                        <time datetime=${item.lastUpdated}>
                          ${this.formatDate(item.lastUpdated)}
                        </time>
                      </p>
                    </header>
                    <dl>
                      <div>
                        <dt>Streak</dt>
                        <dd>${item.current}</dd>
                      </div>
                      <div>
                        <dt>Highest Streak</dt>
                        <dd>${item.max}</dd>
                      </div>
                      <div>
                        <dt>Games Played</dt>
                        <dd>${item.total}</dd>
                      </div>
                    </dl>
                  </li>
                `;
              })}
            </ul>`,
        })}
      </section>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "puzzmo-container": PuzzmoStats;
  }
}
