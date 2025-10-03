export const vnd = (n: number) =>
  new Intl.NumberFormat("vi-VN").format(Math.max(0, Math.round(n)));
