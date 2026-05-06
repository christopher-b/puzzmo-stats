import { describe, expect, it } from "vitest";
import { getGameIconUrl } from "../src/puzzmo-icons.js";

describe("getGameIconUrl", () => {
  it("builds a Puzzmo icon URL", () => {
    const url = new URL(
      getGameIconUrl({
        slug: "flipart",
        foreground: "141620",
        background: "ECECEC",
      }),
    );

    expect(url.origin).toBe("https://api.puzzmo.com");
    expect(url.pathname).toBe("/gameIcon");
    expect(url.searchParams.get("slug")).toBe("flipart");
    expect(url.searchParams.get("fg")).toBe("141620");
    expect(url.searchParams.get("bg")).toBe("ECECEC");
    expect(url.searchParams.get("size")).toBe("24");
  });

  it("accepts CSS-style hex colors", () => {
    const url = new URL(
      getGameIconUrl({
        slug: "crossword",
        foreground: "#ffffff",
        background: "#000000",
        size: 40,
      }),
    );

    expect(url.searchParams.get("fg")).toBe("ffffff");
    expect(url.searchParams.get("bg")).toBe("000000");
    expect(url.searchParams.get("size")).toBe("40");
  });
});
