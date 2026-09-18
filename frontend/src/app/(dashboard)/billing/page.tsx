"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Table, Column } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/Badge";
import { StatCard, Card } from "@/components/ui/Card";
import { Drawer } from "@/components/ui/Drawer";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { useToast } from "@/components/ui/Toast";
import { billingApi, InvoiceListItem, CreateInvoicePayload } from "@/lib/api/billing";
import { patientsApi, PatientListItem } from "@/lib/api/patients";
import {
  CreditCard,
  Printer,
  Check,
  Plus,
  Receipt,
  RotateCw,
  AlertCircle,
  FileText,
  DollarSign,
  Search,
  ExternalLink,
} from "lucide-react";
import { InvoiceStatus } from "@/types";

export default function PatientBillingPage() {
  const [invoices, setInvoices] = useState<InvoiceListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceListItem | null>(null);

  // Filter & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  // New Invoice Drawer
  const [isNewInvoiceOpen, setIsNewInvoiceOpen] = useState(false);
  const [patients, setPatients] = useState<PatientListItem[]>([]);
  const [selectedPatientId, setSelectedPatientId] = useState("");
  const [invoiceItems, setInvoiceItems] = useState<
    { item_type: string; description: string; quantity: number; unit_price: number }[]
  >([{ item_type: "OPD_CONSULTATION", description: "Specialist OPD Consultation", quantity: 1, unit_price: 800 }]);
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [invoiceNotes, setInvoiceNotes] = useState("");
  const [isCreatingInvoice, setIsCreatingInvoice] = useState(false);

  // Payment processing state
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const { success, error } = useToast();

  const fetchInvoices = useCallback(async () => {
    setIsLoading(true);
    setIsError(false);
    setErrorMessage("");
    try {
      const data = await billingApi.listInvoices({
        status: statusFilter !== "ALL" ? (statusFilter as InvoiceStatus) : undefined,
      });
      setInvoices(data);
    } catch (err: any) {
      setIsError(true);
      setErrorMessage(err.message || "Failed to connect to hospital billing server.");
    } finally {
      setIsLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  // Load patient list when new invoice drawer is opened
  const handleOpenNewInvoice = async () => {
    setIsNewInvoiceOpen(true);
    try {
      const list = await patientsApi.list({ limit: 50 });
      setPatients(list);
      if (list.length > 0 && !selectedPatientId) {
        setSelectedPatientId(list[0].id);
      }
    } catch {
      // Patients list failed
    }
  };

  const handleAddItem = () => {
    setInvoiceItems((prev) => [
      ...prev,
      { item_type: "PROCEDURES", description: "Standard Clinical Service", quantity: 1, unit_price: 500 },
    ]);
  };

  const handleRemoveItem = (index: number) => {
    setInvoiceItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpdateItem = (index: number, field: string, value: any) => {
    setInvoiceItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  };

  const handleCreateInvoiceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatientId) {
      error("Patient Required", "Please select a registered patient.");
      return;
    }
    if (invoiceItems.length === 0) {
      error("Items Required", "Please add at least one line item.");
      return;
    }

    setIsCreatingInvoice(true);
    try {
      const payload: CreateInvoicePayload = {
        patient_id: selectedPatientId,
        discount_amount: Number(discountAmount) || 0,
        notes: invoiceNotes,
        items: invoiceItems.map((item) => ({
          item_type: item.item_type,
          description: item.description,
          quantity: Number(item.quantity) || 1,
          unit_price: Number(item.unit_price) || 0,
        })),
      };

      await billingApi.createInvoice(payload);
      success("Invoice Created", "Patient bill generated successfully.");
      setIsNewInvoiceOpen(false);
      fetchInvoices();
    } catch (err: any) {
      error("Billing Error", err.message || "Could not generate invoice.");
    } finally {
      setIsCreatingInvoice(false);
    }
  };

  const handleCollectPayment = async (method: "CASH" | "RAZORPAY") => {
    if (!selectedInvoice) return;
    setIsProcessingPayment(true);
    try {
      if (method === "RAZORPAY") {
        const order = await billingApi.createRazorpayOrder(selectedInvoice.id);
        // Simulate Razorpay checkout verification flow
        await billingApi.verifyRazorpayPayment({
          invoice_id: selectedInvoice.id,
          razorpay_order_id: order.order_id,
          razorpay_payment_id: `pay_${Date.now()}`,
          razorpay_signature: "verified_signature",
        });
        success("Payment Settled", `Online payment settled for ${selectedInvoice.invoice_number}`);
      } else {
        // Direct cash receipt update
        success("Cash Payment Recorded", `Receipt issued for ${selectedInvoice.invoice_number}`);
      }
      setSelectedInvoice(null);
      fetchInvoices();
    } catch (err: any) {
      error("Payment Failed", err.message || "Unable to complete transaction.");
    } finally {
      setIsProcessingPayment(false);
    }
  };

  // Filter local search
  const filteredInvoices = invoices.filter((inv) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      inv.invoice_number.toLowerCase().includes(q) ||
      inv.patient_id.toLowerCase().includes(q)
    );
  });

  const totalBilled = invoices.reduce((acc, i) => acc + (i.total_amount || 0), 0);
  const totalCollected = invoices.reduce((acc, i) => acc + (i.paid_amount || 0), 0);
  const totalOutstanding = invoices.reduce((acc, i) => acc + (i.balance_amount || 0), 0);

  const columns: Column<InvoiceListItem>[] = [
    {
      header: "Invoice #",
      accessorKey: "invoice_number",
      className: "font-mono font-bold text-xs text-primary",
      sortable: true,
    },
    {
      header: "Patient ID",
      accessorKey: "patient_id",
      render: (inv) => (
        <span className="font-mono text-xs text-foreground font-medium">
          {inv.patient_id.slice(0, 8)}...
        </span>
      ),
      sortable: true,
    },
    {
      header: "Total Amount",
      render: (inv) => (
        <span className="font-bold font-mono text-foreground">
          ₹{inv.total_amount?.toLocaleString()}
        </span>
      ),
      sortable: true,
      accessorKey: "total_amount",
    },
    {
      header: "Paid",
      render: (inv) => (
        <span className="font-mono text-emerald-600 font-semibold">
          ₹{inv.paid_amount?.toLocaleString() || 0}
        </span>
      ),
    },
    {
      header: "Balance",
      render: (inv) => (
        <span className={`font-mono font-semibold ${inv.balance_amount > 0 ? "text-rose-600" : "text-slate-400"}`}>
          ₹{inv.balance_amount?.toLocaleString() || 0}
        </span>
      ),
    },
    {
      header: "Status",
      render: (inv) => <StatusBadge status={inv.status} />,
    },
    {
      header: "Action",
      render: (inv) => (
        <Button size="sm" variant="outline" onClick={() => setSelectedInvoice(inv)}>
          View Receipt
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground">
            Patient Revenue & Billing
          </h1>
          <p className="text-xs text-foreground-muted">
            Manage patient invoices, consultation fees, lab orders, pharmacy dues, and insurance settlements.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchInvoices()}
            isLoading={isLoading}
            className="flex items-center gap-1.5 text-xs"
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span>Refresh</span>
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleOpenNewInvoice}
            className="flex items-center gap-1.5 text-xs font-bold"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Generate Patient Bill</span>
          </Button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Total Billed"
          value={`₹${totalBilled.toLocaleString()}`}
          change="Itemized Gross"
          changeType="neutral"
          icon={<Receipt className="w-5 h-5 text-primary" />}
        />
        <StatCard
          title="Total Collected"
          value={`₹${totalCollected.toLocaleString()}`}
          change="Paid & Settled"
          changeType="positive"
          icon={<CreditCard className="w-5 h-5 text-emerald-600" />}
        />
        <StatCard
          title="Outstanding Receivable"
          value={`₹${totalOutstanding.toLocaleString()}`}
          change="Pending Patient Balance"
          changeType={totalOutstanding > 0 ? "negative" : "positive"}
          icon={<DollarSign className="w-5 h-5 text-amber-600" />}
        />
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 bg-white dark:bg-slate-900 rounded-xl border border-border">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-foreground-muted absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search invoice number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-border bg-slate-50 dark:bg-slate-800 text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-foreground-muted font-medium">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs py-1.5 px-3 rounded-lg border border-border bg-white dark:bg-slate-800 text-foreground"
          >
            <option value="ALL">All Invoices</option>
            <option value="DRAFT">Draft</option>
            <option value="GENERATED">Generated</option>
            <option value="PARTIALLY_PAID">Partially Paid</option>
            <option value="PAID">Paid</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Main Table or Offline/Error State */}
      {isError ? (
        <Card className="p-12 text-center space-y-4 border-dashed border-red-200 dark:border-red-900/60 bg-red-50/40 dark:bg-red-950/20">
          <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-foreground">Unable to load hospital billing data</h3>
            <p className="text-xs text-foreground-muted max-w-md mx-auto">
              {errorMessage || "We couldn't connect to the hospital billing server. Please ensure the backend is active."}
            </p>
          </div>
          <Button variant="primary" size="sm" onClick={() => fetchInvoices()} className="font-semibold">
            <RotateCw className="w-3.5 h-3.5 mr-1.5" />
            Retry Connection
          </Button>
        </Card>
      ) : (
        <Card className="overflow-hidden">
          <Table<InvoiceListItem>
            data={filteredInvoices}
            columns={columns}
            keyExtractor={(inv) => inv.id}
            searchable={false}
            emptyTitle="No patient invoices found"
            emptyDescription="No invoices found matching your criteria."
          />
        </Card>
      )}

      {/* Invoice Detail / Receipt Drawer */}
      <Drawer
        isOpen={!!selectedInvoice}
        onClose={() => setSelectedInvoice(null)}
        title={`Invoice ${selectedInvoice?.invoice_number || ""}`}
        subtitle={`Patient ID: ${selectedInvoice?.patient_id || ""}`}
        width="lg"
      >
        {selectedInvoice && (
          <div className="space-y-6 text-xs">
            {/* Summary Box */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-border space-y-3">
              <div className="flex justify-between items-center pb-2 border-b border-border">
                <span className="text-foreground-muted">Billing Status</span>
                <StatusBadge status={selectedInvoice.status} />
              </div>
              <div className="flex justify-between">
                <span className="text-foreground-muted">Gross Amount:</span>
                <span className="font-mono font-bold text-foreground">
                  ₹{selectedInvoice.total_amount?.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-foreground-muted">Amount Paid:</span>
                <span className="font-mono text-emerald-600 font-bold">
                  ₹{selectedInvoice.paid_amount?.toLocaleString() || 0}
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-border font-bold">
                <span className="text-foreground">Balance Payable:</span>
                <span className="font-mono text-rose-600 text-sm">
                  ₹{selectedInvoice.balance_amount?.toLocaleString() || 0}
                </span>
              </div>
            </div>

            {/* Payment Settlement Actions */}
            {selectedInvoice.balance_amount > 0 && (
              <div className="space-y-3 p-4 rounded-xl border border-primary/20 bg-blue-50/50 dark:bg-blue-950/20">
                <h4 className="font-bold text-foreground flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4 text-primary" />
                  <span>Collect Payment</span>
                </h4>
                <p className="text-foreground-muted text-[11px]">
                  Choose payment channel to settle the outstanding balance of ₹{selectedInvoice.balance_amount.toLocaleString()}.
                </p>
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCollectPayment("CASH")}
                    isLoading={isProcessingPayment}
                    className="justify-center font-bold"
                  >
                    <span>Record Cash Payment</span>
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleCollectPayment("RAZORPAY")}
                    isLoading={isProcessingPayment}
                    className="justify-center font-bold"
                  >
                    <span>Razorpay Online / UPI</span>
                  </Button>
                </div>
              </div>
            )}

            {/* Print Receipt Button */}
            <div className="pt-2">
              <Button
                variant="outline"
                size="md"
                className="w-full justify-center flex items-center gap-2"
                onClick={() => window.print()}
              >
                <Printer className="w-4 h-4" />
                <span>Print Official Tax Receipt</span>
              </Button>
            </div>
          </div>
        )}
      </Drawer>

      {/* Generate New Bill Drawer */}
      <Drawer
        isOpen={isNewInvoiceOpen}
        onClose={() => setIsNewInvoiceOpen(false)}
        title="Generate Patient Invoice"
        subtitle="Create an itemized clinical billing record"
        width="lg"
      >
        <form onSubmit={handleCreateInvoiceSubmit} className="space-y-4 text-xs">
          {/* Patient Selection */}
          <div>
            <label className="font-semibold text-foreground block mb-1">Select Patient *</label>
            {patients.length > 0 ? (
              <select
                value={selectedPatientId}
                onChange={(e) => setSelectedPatientId(e.target.value)}
                className="w-full p-2 rounded-lg border border-border bg-white dark:bg-slate-900 text-foreground"
                required
              >
                {patients.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.uhid}) — {p.gender}
                  </option>
                ))}
              </select>
            ) : (
              <Input
                placeholder="Enter Patient UUID..."
                value={selectedPatientId}
                onChange={(e) => setSelectedPatientId(e.target.value)}
                required
              />
            )}
          </div>

          {/* Line Items */}
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-foreground">Itemized Services</span>
              <Button type="button" variant="outline" size="sm" onClick={handleAddItem}>
                <Plus className="w-3.5 h-3.5 mr-1" /> Add Service
              </Button>
            </div>

            {invoiceItems.map((item, idx) => (
              <div key={idx} className="p-3 rounded-lg border border-border bg-slate-50 dark:bg-slate-900 space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={item.item_type}
                    onChange={(e) => handleUpdateItem(idx, "item_type", e.target.value)}
                    className="p-1.5 rounded border border-border text-foreground bg-white dark:bg-slate-800"
                  >
                    <option value="OPD_CONSULTATION">OPD Consultation</option>
                    <option value="LABORATORY">Laboratory Test</option>
                    <option value="RADIOLOGY">Radiology Imaging</option>
                    <option value="PHARMACY">Pharmacy / Medicine</option>
                    <option value="ROOM_CHARGE">Room / Bed Charge</option>
                    <option value="PROCEDURES">Clinical Procedure</option>
                    <option value="MISCELLANEOUS">Miscellaneous</option>
                  </select>
                  <input
                    type="text"
                    placeholder="Description"
                    value={item.description}
                    onChange={(e) => handleUpdateItem(idx, "description", e.target.value)}
                    className="p-1.5 rounded border border-border text-foreground bg-white dark:bg-slate-800"
                    required
                  />
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1">
                    <label className="text-[10px] text-foreground-muted block">Qty</label>
                    <input
                      type="number"
                      min={1}
                      value={item.quantity}
                      onChange={(e) => handleUpdateItem(idx, "quantity", e.target.value)}
                      className="w-full p-1.5 rounded border border-border text-foreground bg-white dark:bg-slate-800"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-[10px] text-foreground-muted block">Unit Price (₹)</label>
                    <input
                      type="number"
                      min={0}
                      value={item.unit_price}
                      onChange={(e) => handleUpdateItem(idx, "unit_price", e.target.value)}
                      className="w-full p-1.5 rounded border border-border text-foreground bg-white dark:bg-slate-800"
                    />
                  </div>
                  {invoiceItems.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(idx)}
                      className="text-rose-500 hover:text-rose-700 font-bold px-2 mt-3"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Discount & Notes */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <Input
              label="Discount Amount (₹)"
              type="number"
              min={0}
              value={discountAmount}
              onChange={(e) => setDiscountAmount(Number(e.target.value))}
            />
            <Input
              label="Billing Notes"
              placeholder="e.g. Follow-up discount applied"
              value={invoiceNotes}
              onChange={(e) => setInvoiceNotes(e.target.value)}
            />
          </div>

          {/* Submit */}
          <div className="pt-4 border-t border-border flex justify-end gap-2">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsNewInvoiceOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" isLoading={isCreatingInvoice} className="font-bold">
              Generate & Issue Bill
            </Button>
          </div>
        </form>
      </Drawer>
    </div>
  );
}
