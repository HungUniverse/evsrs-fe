import type { UserFull } from "@/@types/auth.type";
import type { IdentifyDocumentResponse } from "@/@types/identify-document";
import { UserFullAPI } from "@/apis/user.api";
import { identifyDocumentAPI } from "@/apis/identify-document.api";

const DEFAULT_PAGINATION = {
  page: 1,
  limit: 100,
};

async function fetchRenterUsers(): Promise<UserFull[]> {
  const response = await UserFullAPI.getAll(DEFAULT_PAGINATION.page, DEFAULT_PAGINATION.limit);
  const items = response?.data?.data?.items;
  return Array.isArray(items) ? items : [];
}

async function fetchUserDocument(userId: string): Promise<IdentifyDocumentResponse | null> {
  try {
    const response = await identifyDocumentAPI.getUserDocuments(userId);
    return response.data;
  } catch {
    return null;
  }
}

async function fetchAllUserDocuments(userIds: string[]): Promise<Record<string, IdentifyDocumentResponse | null>> {
  const results = await Promise.all(
    userIds.map(async (userId) => {
      try {
        const doc = await fetchUserDocument(userId);
        return { userId, doc };
      } catch {
        return { userId, doc: null };
      }
    })
  );

  return results.reduce<Record<string, IdentifyDocumentResponse | null>>((acc, { userId, doc }) => {
    acc[userId] = doc;
    return acc;
  }, {});
}

async function updateDocumentStatus(
  documentId: string,
  status: "APPROVED" | "REJECTED",
  note?: string
): Promise<IdentifyDocumentResponse> {
  const response = await identifyDocumentAPI.updateStatus(documentId, { status, note });
  return response.data;
}

async function deleteRenterUsers(ids: string[]): Promise<void> {
  await Promise.all(ids.map((id) => UserFullAPI.delete(id)));
}

export const RenterTableApi = {
  fetchRenterUsers,
  fetchUserDocument,
  fetchAllUserDocuments,
  updateDocumentStatus,
  deleteRenterUsers,
};

export type RenterTableApiType = typeof RenterTableApi;

