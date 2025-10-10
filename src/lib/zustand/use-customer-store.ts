import { create } from "zustand";
import { mockCustomers, type Customer } from "@/mockdata/mock-admin";

type CustomerState = {
  customers: Customer[];
  setCustomers: (next: Customer[] | ((prev: Customer[]) => Customer[])) => void;
  updateCustomer: (id: string, updater: (c: Customer) => Customer) => void;
  bulkUpdate: (ids: string[], updater: (c: Customer) => Customer) => void;
};

export const useCustomerStore = create<CustomerState>((set) => ({
  customers: mockCustomers,
  setCustomers: (next) =>
    set((state) => ({ customers: typeof next === "function" ? (next as any)(state.customers) : next })),
  updateCustomer: (id, updater) =>
    set((state) => ({ customers: state.customers.map((c) => (c.id === id ? updater(c) : c)) })),
  bulkUpdate: (ids, updater) =>
    set((state) => ({ customers: state.customers.map((c) => (ids.includes(c.id) ? updater(c) : c)) })),
}));


