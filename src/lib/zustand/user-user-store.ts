import { create } from "zustand";
import type { User } from "@/@types/auth.type";
import { mockUsers } from "@/mockdata/mock-user";

type UserState = {
  users: User[];
  setUsers: (next: User[] | ((prev: User[]) => User[])) => void;
  updateUser: (id: string, updater: (u: User) => User) => void;
  bulkUpdate: (ids: string[], updater: (u: User) => User) => void;
};

export const useUserStore = create<UserState>((set) => ({
  users: mockUsers,
  setUsers: (next) =>
    set((state) => ({ users: typeof next === "function" ? (next as any)(state.users) : next })),
  updateUser: (id, updater) =>
    set((state) => ({ users: state.users.map((u) => (u.id === id ? updater(u) : u)) })),
  bulkUpdate: (ids, updater) =>
    set((state) => ({ users: state.users.map((u) => (ids.includes(u.id) ? updater(u) : u)) })),
}));


