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
    api.get<ListBaseResponse<OrderBookingDetail>>(
      `/api/OrderBooking/user/${id}`
    ),
};
