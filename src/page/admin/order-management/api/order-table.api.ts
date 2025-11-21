import type { OrderBookingDetail } from "@/@types/order/order-booking";
import type { OrderBookingStatus, PaymentStatus } from "@/@types/enum";
import type { UserFull } from "@/@types/auth.type";
import type { Depot } from "@/@types/car/depot";
import type { Model } from "@/@types/car/model";
import { orderBookingAPI, type OrderBookingQuery } from "@/apis/order-booking.api";
import { UserFullAPI } from "@/apis/user.api";
import { depotAPI } from "@/apis/depot.api";
import { modelAPI } from "@/apis/model-ev.api";

const DEFAULT_PAGINATION = {
  page: 1,
  limit: 100,
};

async function fetchOrders(query: OrderBookingQuery = {}): Promise<{
  items: OrderBookingDetail[];
  totalPages: number;
  totalCount: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}> {
  const response = await orderBookingAPI.getAll(query);
  const data = response.data?.data;
  
  if (!data) {
    return {
      items: [],
      totalPages: 0,
      totalCount: 0,
      hasNextPage: false,
      hasPreviousPage: false,
    };
  }

  return {
    items: data.items || [],
    totalPages: data.totalPages || 0,
    totalCount: data.totalCount || 0,
    hasNextPage: data.hasNextPage || false,
    hasPreviousPage: data.hasPreviousPage || false,
  };
}

async function fetchOrderById(orderId: string): Promise<OrderBookingDetail | null> {
  try {
    const response = await orderBookingAPI.getById(orderId);
    return response.data?.data || null;
  } catch {
    return null;
  }
}

async function fetchOrdersByCode(code: string, query: OrderBookingQuery = {}): Promise<{
  items: OrderBookingDetail[];
  totalPages: number;
  totalCount: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}> {
  const response = await orderBookingAPI.getAll({ ...query, search: code });
  const data = response.data?.data;
  
  if (!data) {
    return {
      items: [],
      totalPages: 0,
      totalCount: 0,
      hasNextPage: false,
      hasPreviousPage: false,
    };
  }

  return {
    items: data.items || [],
    totalPages: data.totalPages || 0,
    totalCount: data.totalCount || 0,
    hasNextPage: data.hasNextPage || false,
    hasPreviousPage: data.hasPreviousPage || false,
  };
}

async function fetchUsers(): Promise<UserFull[]> {
  try {
    const response = await UserFullAPI.getAll(DEFAULT_PAGINATION.page, DEFAULT_PAGINATION.limit);
    const items = response?.data?.data?.items;
    if (!Array.isArray(items)) return [];
    return items.filter((user) => user.role === "USER");
  } catch {
    return [];
  }
}

async function fetchDepots(): Promise<Depot[]> {
  try {
    const response = await depotAPI.getAll(DEFAULT_PAGINATION.page, DEFAULT_PAGINATION.limit);
    const items = response?.data?.data?.items;
    return Array.isArray(items) ? items : [];
  } catch {
    return [];
  }
}

async function fetchModels(): Promise<Model[]> {
  try {
    const response = await modelAPI.getAll(1, 9999);
    const items = response?.data?.data?.items;
    return Array.isArray(items) ? items : [];
  } catch {
    return [];
  }
}

async function updateOrderStatus(
  orderId: string,
  status: OrderBookingStatus,
  paymentStatus: PaymentStatus
): Promise<OrderBookingDetail> {
  return await orderBookingAPI.updateStatus(orderId, status, paymentStatus);
}

async function deleteOrder(orderId: string): Promise<void> {
  await orderBookingAPI.delete(orderId);
}

export const OrderTableApi = {
  fetchOrders,
  fetchOrderById,
  fetchOrdersByCode,
  fetchUsers,
  fetchDepots,
  fetchModels,
  updateOrderStatus,
  deleteOrder,
};

export type OrderTableApiType = typeof OrderTableApi;

