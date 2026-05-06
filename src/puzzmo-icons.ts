export type ColorScheme = {
  foreground: string;
  background: string;
};

const colors = {
  dark: "141620",
  light: "ECECEC",
} as const;

export function getPreferredColorScheme(): ColorScheme {
  const prefersDark =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-color-scheme: dark)").matches;

  return prefersDark
    ? { foreground: colors.light, background: colors.dark }
    : { foreground: colors.dark, background: colors.light };
}

export function getGameIconUrl({
  slug,
  foreground,
  background,
  size = 24,
}: {
  slug: string;
  foreground: string;
  background: string;
  size?: number;
}): string {
  const params = new URLSearchParams({
    slug,
    fg: normalizeIconColor(foreground),
    bg: normalizeIconColor(background),
    size: String(size),
  });

  return `https://api.puzzmo.com/gameIcon?${params}`;
}

function normalizeIconColor(color: string): string {
  return color.trim().replace(/^#/, "");
}
