/* eslint-disable @typescript-eslint/no-explicit-any */
import type { User } from "@/@types/auth.type";
import type { UserFull } from "@/@types/auth.type";

type UserLike = User | UserFull | undefined | null;

export function getEmail(u: UserLike) {
  return (u as any)?.email ?? (u as any)?.userEmail ?? undefined;
}
export function getPhone(u: UserLike) {
  return (u as any)?.phone ?? (u as any)?.phoneNumber ?? undefined;
}
