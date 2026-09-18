import { http } from "./client";

export interface AuditLogItem {
  id: string;
  action: string;
  resource_type: string;
  resource_id?: string;
  description: string;
  user_id?: string;
  ip_address?: string;
  created_at: string;
}

export const auditApi = {
  async list(filters?: {
    action?: string;
    resource_type?: string;
    user_id?: string;
    page?: number;
    limit?: number;
  }): Promise<AuditLogItem[]> {
    const query = new URLSearchParams();
    if (filters?.action) query.set("action", filters.action);
    if (filters?.resource_type) query.set("resource_type", filters.resource_type);
    if (filters?.user_id) query.set("user_id", filters.user_id);
    if (filters?.page) query.set("page", String(filters.page));
    if (filters?.limit) query.set("limit", String(filters.limit));

    const qs = query.toString();
    const res = await http.get<any>(`/audit/${qs ? `?${qs}` : ""}`);
    if (Array.isArray(res)) return res;
    if (res?.logs && Array.isArray(res.logs)) return res.logs;
    return [];
  },
};
