const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

export function formatDate(date: string): string {
  return dateFormatter.format(new Date(date));
}
