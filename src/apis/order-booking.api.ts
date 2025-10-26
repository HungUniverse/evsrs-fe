import { api } from "@/lib/axios/axios";
import type { ItemBaseResponse, ListBaseResponse } from "@/@types/response";
import type {
  OrderBookingRequest,
  OrderBookingResponse,
  OrderBookingDetail,
  ID,
  DateString,
} from "@/@types/order/order-booking";
import type {
  OrderBookingStatus,
  PaymentMethod,
  PaymentStatus,
  PaymentType,
} from "@/@types/enum";

export type OrderBookingQuery = {
  pageNumber?: number;
  pageSize?: number;
  status?: OrderBookingStatus;
  paymentStatus?: PaymentStatus;
  paymentMethod?: PaymentMethod;
  paymentType?: PaymentType;
  depotId?: ID;
  userId?: ID;
  from?: DateString;
  to?: DateString;
  search?: string;
};

export const orderBookingAPI = {
  create: (body: OrderBookingRequest) =>
    api.post<OrderBookingResponse>("/api/OrderBooking", body),

  getById: (id: ID) =>
    api.get<ItemBaseResponse<OrderBookingDetail>>(`/api/OrderBooking/${id}`),

  getAll: (query: OrderBookingQuery = {}) =>
    api.get<ListBaseResponse<OrderBookingDetail>>("/api/OrderBooking", {
      params: {
        pageNumber: query.pageNumber ?? 1,
        pageSize: query.pageSize ?? 10,
        status: query.status,
        paymentStatus: query.paymentStatus,
        paymentMethod: query.paymentMethod,
        paymentType: query.paymentType,
        depotId: query.depotId,
        userId: query.userId,
        from: query.from,
        to: query.to,
        search: query.search,
      },
    }),
  getByUserId: (id: ID) =>
    api.get<ItemBaseResponse<OrderBookingDetail[]>>(
      `/api/OrderBooking/user/${id}`
    ),
  getByDepotId: (id: ID) =>
    api.get<ItemBaseResponse<OrderBookingDetail[]>>(
      `/api/OrderBooking/depot/${id}`
    ),
  checkout: async (id: ID): Promise<OrderBookingDetail> => {
    const res = await api.post<ItemBaseResponse<OrderBookingDetail>>(
      `/api/OrderBooking/${id}/checkout`,
      {}
    );
    return res.data.data;
  },
  start: async (id: ID): Promise<OrderBookingDetail> => {
    const res = await api.post<ItemBaseResponse<OrderBookingDetail>>(
      `/api/OrderBooking/${id}/start`,
      {}
    );
    return res.data.data;
  },
  return: async (id: ID): Promise<OrderBookingDetail> => {
    const res = await api.post<ItemBaseResponse<OrderBookingDetail>>(
      `/api/OrderBooking/${id}/return`,
      {}
    );
    return res.data.data;
  },
  updateStatus: async (id: ID, status: OrderBookingStatus, paymentStatus: PaymentStatus) => {
    const res = await api.patch<ItemBaseResponse<OrderBookingDetail>>(
      `/api/OrderBooking/${id}/status`,
      { status, paymentStatus }
    );
    return res.data.data;
  },
  update: async (id: ID, body: OrderBookingRequest) => {
    const res = await api.put<ItemBaseResponse<OrderBookingDetail>>(
      `/api/OrderBooking/${id}`,
      body
    );
    return res.data.data;
  },
  delete: async (id: ID) => {
    await api.delete<ItemBaseResponse<OrderBookingDetail>>(
      `/api/OrderBooking/${id}`
    );
  },
};
