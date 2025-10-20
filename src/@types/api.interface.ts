import type { UseFormRegister, FieldValues } from "react-hook-form";
import type { ListBaseResponse } from "./response";
import type { AxiosResponse } from "axios";

// Generic interface for CRUD API functions
export interface CrudAPI<T, TRequest = Partial<T>> {
  getAll: (pageNumber?: number, pageSize?: number) => Promise<AxiosResponse<ListBaseResponse<T>>>;
  getById: (id: string) => Promise<T>;
  create: (data: TRequest) => Promise<T>;
  update: (id: string, data: TRequest) => Promise<T>;
  delete: (id: string) => Promise<void>;
}

// Generic interface for form items
export interface FormItem<T extends FieldValues = Record<string, unknown>> {
  name: string;
  label: string;
  type?: "text" | "number" | "email" | "password" | "date";
  required?: boolean;
  placeholder?: string;
  render?: (register: UseFormRegister<T>) => React.ReactNode;
}

// Generic interface for sort options
export interface SortOption<T = Record<string, unknown>> {
  value: string;
  label: string;
  sortFn: (a: T, b: T) => number;
}
