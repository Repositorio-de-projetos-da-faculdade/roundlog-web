// Cliente para histórico in-app + push subscriptions.
import { apiFetch } from "./client";

export interface InAppNotification {
  id: string;
  userId: string;
  type: string;
  title: string;
  body: string;
  url: string | null;
  readAt: string | null;
  createdAt: string;
}

export interface PaginatedNotifications {
  total: number;
  unreadCount: number;
  skip: number;
  take: number;
  items: InAppNotification[];
}

export interface ListNotificationsParams {
  unreadOnly?: boolean;
  skip?: number;
  take?: number;
}

export const getNotifications = (params: ListNotificationsParams = {}) => {
  const qs = new URLSearchParams();
  if (params.unreadOnly) qs.set("unreadOnly", "true");
  if (params.skip != null) qs.set("skip", String(params.skip));
  if (params.take != null) qs.set("take", String(params.take));
  const suffix = qs.toString() ? `?${qs}` : "";
  return apiFetch<PaginatedNotifications>(`/notifications${suffix}`);
};

export const markNotificationRead = (id: string) =>
  apiFetch<InAppNotification>(`/notifications/${id}/read`, { method: "PATCH" });

export const markAllNotificationsRead = () =>
  apiFetch<{ updated: number }>(`/notifications/read-all`, { method: "POST" });

// --- Push (apenas PWA usa, mas espelha aqui pra consistência) ---

export interface PublicKeyResponse {
  publicKey: string | null;
  enabled: boolean;
}

export const getPushPublicKey = () =>
  apiFetch<PublicKeyResponse>(`/notifications/public-key`);
