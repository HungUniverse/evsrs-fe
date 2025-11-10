/**
 * Formats an ISO date string to Vietnamese locale format with time
 * @param iso - ISO date string
 * @returns Formatted date string in Vietnamese format with AM/PM or "—" if invalid
 */
export function formatDate(iso?: string): string {
  if (!iso) return "—";
  try {
    const date = new Date(iso);
    const dateStr = date.toLocaleDateString("vi-VN");
    const hours24 = date.getHours();
    const hours12 = hours24 === 0 ? 12 : hours24 > 12 ? hours24 - 12 : hours24;
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const ampm = hours24 >= 12 ? "PM" : "AM";
    return `${dateStr} ${hours12.toString().padStart(2, "0")}:${minutes} ${ampm}`;
  } catch {
    return iso;
  }
}
