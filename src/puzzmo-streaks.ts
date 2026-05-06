import {
  getAtprotoRecordKey,
  listRecordsForHandle,
  type AtprotoRecord,
} from "./lib/atproto";

export type PuzzmoStreakRecord = AtprotoRecord & {
  current?: number;
  gameDisplayName?: string;
  gameSlug?: string;
  lastUpdated: string;
  max?: number;
  syncedAt?: string;
  teamSlug?: string;
  total?: number;
};

export type PuzzmoStreak = {
  current: number;
  gameDisplayName: string;
  gameSlug: string;
  lastUpdated: string;
  max: number;
  total: number;
};

const collection = "com.puzzmo.streak";
const recordLimit = 50;
const teamSlug = "puzzmo";

export async function listPuzzmoStreaks(
  handle: string,
): Promise<PuzzmoStreak[]> {
  if (!handle.trim()) {
    return [];
  }

  const { records } = await listRecordsForHandle<PuzzmoStreakRecord>({
    collection,
    handle,
    limit: recordLimit,
  });

  return records
    .filter(({ value }) => value.teamSlug === teamSlug && value.gameSlug)
    .sort((a, b) => {
      return (
        (b.value.current ?? 0) - (a.value.current ?? 0) ||
        (b.value.total ?? 0) - (a.value.total ?? 0) ||
        (b.value.max ?? 0) - (a.value.max ?? 0) ||
        getAtprotoRecordKey(a.uri).localeCompare(getAtprotoRecordKey(b.uri))
      );
    })
    .map(({ value }) => ({
      current: value.current ?? 0,
      gameDisplayName:
        value.gameDisplayName ?? value.gameSlug ?? "Unknown game",
      gameSlug: value.gameSlug ?? "",
      lastUpdated: value.lastUpdated,
      max: value.max ?? 0,
      total: value.total ?? 0,
    }));
}
