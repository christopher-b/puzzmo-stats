import { describe, expect, it, vi } from "vitest";
import { listPuzzmoStreaks } from "../src/puzzmo-streaks.js";
import "../src/puzzmo-stats.js";

vi.mock("../src/puzzmo-streaks.js", () => ({
  listPuzzmoStreaks: vi.fn(),
}));

const listPuzzmoStreaksMock = vi.mocked(listPuzzmoStreaks);

describe("puzzmo-stats", () => {
  it("defines the custom element", () => {
    expect(customElements.get("puzzmo-stats")).toBeDefined();
  });

  it("renders the initial empty-handle state", async () => {
    const element = document.createElement("puzzmo-stats");
    document.body.append(element);

    await element.updateComplete;

    expect(element.shadowRoot?.textContent).toContain(
      "Add an ATProto handle to load Puzzmo stats.",
    );
    expect(listPuzzmoStreaksMock).not.toHaveBeenCalled();

    element.remove();
  });

  it("renders loaded streak data", async () => {
    listPuzzmoStreaksMock.mockResolvedValueOnce([
      {
        current: 7,
        gameDisplayName: "Flipart",
        gameSlug: "flipart",
        lastUpdated: "2026-05-06T00:00:00.000Z",
        max: 12,
        total: 42,
      },
    ]);

    const element = document.createElement("puzzmo-stats");
    element.handle = "cbennell.com";
    document.body.append(element);

    await element.updateComplete;
    await new Promise((resolve) => setTimeout(resolve, 0));
    await element.updateComplete;

    const text = element.shadowRoot?.textContent ?? "";

    expect(text).toContain("Flipart");
    expect(text).toContain("Streak");
    expect(text).toContain("7");
    expect(listPuzzmoStreaksMock).toHaveBeenCalledWith("cbennell.com");

    element.remove();
  });
});
