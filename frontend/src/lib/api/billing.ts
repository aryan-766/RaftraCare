import { http } from "./client";
import { InvoiceStatus } from "@/types";

export interface InvoiceItemPayload {
  item_type?: string;
  description: string;
  quantity: number;
  unit_price: number;
}

export interface CreateInvoicePayload {
  patient_id: string;
  discount_amount?: number;
  notes?: string;
  items: InvoiceItemPayload[];
}

export interface InvoiceListItem {
  id: string;
  invoice_number: string;
  patient_id: string;
  total_amount: number;
  paid_amount: number;
  balance_amount: number;
  status: InvoiceStatus;
  created_at: string;
}

export interface InvoicesResponse {
  invoices: InvoiceListItem[];
  meta?: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
}

export interface RazorpayOrderResponse {
  order_id: string;
  amount: number;
  currency: string;
  invoice_number: string;
}

export interface VerifyPaymentPayload {
  invoice_id: string;
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export const billingApi = {
  async listInvoices(params?: {
    patient_id?: string;
    status?: InvoiceStatus;
    page?: number;
    limit?: number;
  }): Promise<InvoiceListItem[]> {
    const query = new URLSearchParams();
    if (params?.patient_id) query.set("patient_id", params.patient_id);
    if (params?.status) query.set("status", params.status);
    if (params?.page) query.set("page", String(params.page));
    if (params?.limit) query.set("limit", String(params.limit));

    const qs = query.toString();
    const res = await http.get<any>(`/billing/invoices${qs ? `?${qs}` : ""}`);
    if (Array.isArray(res)) return res;
    if (res?.invoices && Array.isArray(res.invoices)) return res.invoices;
    return [];
  },

  async createInvoice(payload: CreateInvoicePayload): Promise<any> {
    return http.post("/billing/invoices", payload);
  },

  async createRazorpayOrder(invoiceId: string): Promise<RazorpayOrderResponse> {
    return http.post<RazorpayOrderResponse>("/billing/razorpay/create-order", { invoice_id: invoiceId });
  },

  async verifyRazorpayPayment(payload: VerifyPaymentPayload): Promise<any> {
    return http.post("/billing/razorpay/verify-payment", payload);
  },

  async getCurrentSubscription(): Promise<any> {
    return http.get("/billing/subscription/current");
  },

  async getSubscriptionPlans(): Promise<any[]> {
    return http.get<any[]>("/billing/subscription/plans");
  },

  async checkoutSubscription(payload: { plan_tier: string; billing_cycle: "MONTHLY" | "YEARLY" }): Promise<any> {
    return http.post("/billing/subscription/checkout", payload);
  },

  async refundPayment(paymentId: string, amount: number, reason: string): Promise<any> {
    return http.post("/billing/payments/refund", { payment_id: paymentId, amount, reason });
  },
};

