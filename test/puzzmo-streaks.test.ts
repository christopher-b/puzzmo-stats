import { describe, expect, it, vi } from "vitest";
import { listRecordsForHandle } from "../src/lib/atproto.js";
import { listPuzzmoStreaks } from "../src/puzzmo-streaks.js";

vi.mock("../src/lib/atproto.js", () => ({
  getAtprotoRecordKey: (uri: string) => uri.split("/").at(-1) ?? "",
  listRecordsForHandle: vi.fn(),
}));

const listRecordsForHandleMock = vi.mocked(listRecordsForHandle);

describe("listPuzzmoStreaks", () => {
  it("does not request records without a handle", async () => {
    await expect(listPuzzmoStreaks("  ")).resolves.toEqual([]);
    expect(listRecordsForHandleMock).not.toHaveBeenCalled();
  });

  it("filters, sorts, and normalizes Puzzmo streak records", async () => {
    listRecordsForHandleMock.mockResolvedValueOnce({
      did: "did:plc:test",
      records: [
        {
          uri: "at://did:plc:test/com.puzzmo.streak/b",
          value: {
            current: 2,
            gameDisplayName: "Crossword",
            gameSlug: "crossword",
            lastUpdated: "2026-05-01T00:00:00.000Z",
            max: 4,
            teamSlug: "puzzmo",
            total: 10,
          },
        },
        {
          uri: "at://did:plc:test/com.puzzmo.streak/a",
          value: {
            current: 5,
            gameSlug: "flipart",
            lastUpdated: "2026-05-02T00:00:00.000Z",
            teamSlug: "puzzmo",
          },
        },
        {
          uri: "at://did:plc:test/com.puzzmo.streak/c",
          value: {
            current: 100,
            gameDisplayName: "Other Game",
            gameSlug: "other",
            lastUpdated: "2026-05-03T00:00:00.000Z",
            teamSlug: "not-puzzmo",
          },
        },
      ],
    });

    await expect(listPuzzmoStreaks("cbennell.com")).resolves.toEqual([
      {
        current: 5,
        gameDisplayName: "flipart",
        gameSlug: "flipart",
        lastUpdated: "2026-05-02T00:00:00.000Z",
        max: 0,
        total: 0,
      },
      {
        current: 2,
        gameDisplayName: "Crossword",
        gameSlug: "crossword",
        lastUpdated: "2026-05-01T00:00:00.000Z",
        max: 4,
        total: 10,
      },
    ]);

    expect(listRecordsForHandleMock).toHaveBeenCalledWith({
      collection: "com.puzzmo.streak",
      handle: "cbennell.com",
      limit: 50,
    });
  });
});
