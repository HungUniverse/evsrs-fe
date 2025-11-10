import type { BadgeProps } from "@/components/ui/badge";

type LevelValue = string | null | undefined;
type LevelBadgeProps = Pick<BadgeProps, "variant" | "className">;

const DEFAULT_BADGE_PROPS: LevelBadgeProps = {
  variant: "outline",
  className: "border-dashed border-muted-foreground/40 text-muted-foreground bg-muted",
};

const LEVEL_BADGE_CLASSNAMES: Record<string, string> = {
  BRONZE: "border-none bg-gradient-to-r from-amber-500 via-orange-500 to-amber-400 text-white shadow-sm",
  SILVER: "border-none bg-gradient-to-r from-slate-400 via-gray-500 to-slate-600 text-white shadow-sm",
  GOLD: "border-none bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 text-white shadow-sm",
  DEFAULT: "border-none bg-gradient-to-r from-primary/80 via-primary to-primary/90 text-primary-foreground shadow-sm",
};

const LEVEL_DISPLAY_NAMES: Record<string, string> = {
  BRONZE: "Đồng",
  SILVER: "Bạc",
  GOLD: "Vàng",
  NONE: "Không có",
};

const normalizeLevel = (level: LevelValue): string => {
  if (!level) return "";
  return level.toString().trim().toUpperCase();
};

export const getLevelBadgeProps = (level: LevelValue): LevelBadgeProps => {
  const normalized = normalizeLevel(level);

  if (!normalized || normalized === "NONE") {
    return DEFAULT_BADGE_PROPS;
  }

  return {
    variant: "outline",
    className: LEVEL_BADGE_CLASSNAMES[normalized] ?? LEVEL_BADGE_CLASSNAMES.DEFAULT,
  };
};

export const getLevelDisplayName = (level: LevelValue): string => {
  const normalized = normalizeLevel(level);

  if (!normalized || normalized === "NONE") {
    return LEVEL_DISPLAY_NAMES.NONE;
  }

  return LEVEL_DISPLAY_NAMES[normalized] ?? level?.toString() ?? LEVEL_DISPLAY_NAMES.NONE;
};

