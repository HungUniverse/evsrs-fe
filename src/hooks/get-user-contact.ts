import type { UserFull } from "@/@types/auth.type";

type UserLike = UserFull;

export function getEmail(u: UserLike) {
  return u?.userEmail ?? undefined;
}
export function getPhone(u: UserLike) {
  return u?.phoneNumber ?? undefined;
}
