import type { StaffRequest, UserFull } from "@/@types/auth.type";
import type { Depot } from "@/@types/car/depot";
import { UserFullAPI } from "@/apis/user.api";
import { depotAPI } from "@/apis/depot.api";

const DEFAULT_PAGINATION = {
  page: 1,
  limit: 100,
};

async function fetchStaffUsers(): Promise<UserFull[]> {
  const response = await UserFullAPI.getAll(DEFAULT_PAGINATION.page, DEFAULT_PAGINATION.limit);
  const items = response?.data?.data?.items;
  return Array.isArray(items) ? items : [];
}

async function fetchDepotList(): Promise<Depot[]> {
  const response = await depotAPI.getAll(DEFAULT_PAGINATION.page, DEFAULT_PAGINATION.limit);
  const items = response?.data?.data?.items;
  return Array.isArray(items) ? items : [];
}

async function fetchDepotMapByIds(depotIds: string[]): Promise<Record<string, Depot>> {
  if (!depotIds.length) {
    return {};
  }

  const uniqueIds = Array.from(new Set(depotIds));
  const results = await Promise.all(
    uniqueIds.map(async (depotId) => {
      try {
        const response = await depotAPI.getById(depotId);
        return response ?? null;
      } catch (error) {
        console.error(`Failed to fetch depot ${depotId}`, error);
        return null;
      }
    })
  );

  return results.reduce<Record<string, Depot>>((accumulator, depot, index) => {
    if (depot) {
      const id = uniqueIds[index];
      accumulator[id] = depot;
    }
    return accumulator;
  }, {});
}

async function deleteStaffUsers(ids: string[]): Promise<void> {
  await Promise.all(ids.map((id) => UserFullAPI.delete(id)));
}

async function createStaffUser(payload: StaffRequest): Promise<UserFull> {
  const response = await UserFullAPI.createStaff(payload);
  return response;
}

async function updateStaffDepot(userId: string, depotId: string): Promise<void> {
  await UserFullAPI.updateDepot(userId, depotId);
}

export const StaffTableApi = {
  fetchStaffUsers,
  fetchDepotList,
  fetchDepotMapByIds,
  deleteStaffUsers,
  createStaffUser,
  updateStaffDepot,
};

export type StaffTableApiType = typeof StaffTableApi;

