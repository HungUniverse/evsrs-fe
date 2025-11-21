export function getImageUrl(imageString: string | null): string {
  if (!imageString) return "";

  if (imageString.startsWith("data:")) {
    return imageString;
  }

  if (imageString.startsWith("http")) {
    return imageString;
  }

  return `data:image/jpeg;base64,${imageString}`;
}

export function getDocStatus(
  hasImage: boolean | undefined,
  status: string
): "missing" | "ok" | "review" {
  if (!hasImage) return "missing";
  if (status === "APPROVED") return "ok";
  return "review";
}

export function getStatusLabel(status: string): string {
  const statusMap: Record<string, string> = {
    PENDING: "Đang chờ",
    APPROVED: "Đã xác thực",
    REJECTED: "Chưa xác thực",
  };
  return statusMap[status] || status;
}

