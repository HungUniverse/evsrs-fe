export function splitUrls(s?: string | null) {
  if (!s) return [];
  return String(s)
    .split(/[,\n;]+/)
    .map((x) => x.trim())
    .filter(Boolean);
}
