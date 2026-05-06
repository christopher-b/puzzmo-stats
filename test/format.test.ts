import { describe, expect, it } from "vitest";
import { formatDate } from "../src/format.js";

describe("formatDate", () => {
  it("formats dates for display", () => {
    expect(formatDate("2026-05-06T12:00:00.000Z")).toBe("6 May 2026");
  });
});
