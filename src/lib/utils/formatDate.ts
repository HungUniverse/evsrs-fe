/**
 * Formats an ISO date string to Vietnamese locale format with time
 * @param iso - ISO date string
 * @returns Formatted date string in Vietnamese format or "—" if invalid
 */
export function formatDate(iso?: string): string {
  if (!iso) return "—";
  try {
    const date = new Date(iso);
    const dateStr = date.toLocaleDateString("vi-VN");
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${dateStr} ${hours}:${minutes}`;
  } catch {
    return iso;
  }
}
