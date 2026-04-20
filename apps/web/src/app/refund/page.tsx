"use client";
import { useState } from "react";
import { CheckCircle, AlertTriangle } from "lucide-react";
import { useToast } from "@/components/Toast";

const MOCK_ORDERS = [
  { id: "KP-1001", items: "Kuhlad Pizza × 2, Mojito × 1", total: 497, date: "2024-03-15", status: "delivered" },
  { id: "KP-1002", items: "BBQ Chicken Pizza × 1, Cold Coffee × 2", total: 507, date: "2024-03-18", status: "delivered" },
  { id: "KP-1003", items: "Paneer Tikka × 1, Veg Wrap × 2, Blue Lagoon × 1", total: 636, date: "2024-03-20", status: "delivered" },
];

const REASONS = [
  "Wrong item delivered",
  "Food quality was poor",
  "Order was incomplete",
  "Food arrived cold/stale",
  "Took too long to deliver",
  "Other",
];

export default function RefundPage() {
  const toast = useToast();
  const [selectedOrder, setSelectedOrder] = useState("");
  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");
  const [contact, setContact] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [refundId, setRefundId] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!selectedOrder) { toast("Please select an order", "error"); return; }
    if (!reason) { toast("Please select a reason", "error"); return; }
    if (!contact.trim()) { toast("Please enter contact details", "error"); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/refunds", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: selectedOrder, reason, description, contact }),
      });
      const data = await res.json();
      setRefundId(data.id);
      setSubmitted(true);
      toast("Refund request submitted! 📋", "success");
    } catch { toast("Failed to submit. Try again.", "error"); }
    finally { setLoading(false); }
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFF8EE] px-4">
        <div className="bg-white rounded-3xl shadow-2xl p-10 max-w-md w-full text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-5" />
          <h2 className="font-['Playfair_Display'] text-3xl font-bold text-[#1A0A00] mb-2">Request Submitted!</h2>
          <p className="text-[#1A0A00]/60 mb-5">We&apos;ll review your refund request and respond within 24–48 hours</p>
          <div className="bg-[#FFF8EE] rounded-xl p-4 mb-6">
            <p className="text-sm text-[#1A0A00]/50">Refund Request ID</p>
            <p className="font-mono font-bold text-[#C84B11] text-lg">{refundId}</p>
          </div>
          <p className="text-sm text-[#1A0A00]/50">Our team will contact you at: <strong>{contact}</strong></p>
          <button
            onClick={() => { setSubmitted(false); setSelectedOrder(""); setReason(""); setDescription(""); setContact(""); }}
            className="mt-6 w-full border border-[#C84B11] text-[#C84B11] font-semibold py-3 rounded-xl hover:bg-[#C84B11] hover:text-white transition-all"
          >
            Submit Another Request
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 font-['DM_Sans']">
      <div className="text-center mb-10">
        <p className="text-[#C84B11] font-semibold text-sm uppercase tracking-widest mb-2">We&apos;re Here to Help</p>
        <h1 className="font-['Playfair_Display'] text-4xl font-bold text-[#1A0A00]">Request a Refund</h1>
        <p className="text-[#1A0A00]/60 mt-2">Not satisfied? Let us make it right.</p>
      </div>

      <div className="bg-white rounded-3xl shadow-md p-6 space-y-5">
        {/* Order selection */}
        <div>
          <label className="text-sm font-semibold text-[#1A0A00] mb-3 block">Select Your Order</label>
          <div className="space-y-2">
            {MOCK_ORDERS.map((o) => (
              <label key={o.id} className={`flex items-start gap-3 p-4 rounded-2xl border-2 cursor-pointer transition-all ${selectedOrder === o.id ? "border-[#C84B11] bg-[#C84B11]/5" : "border-[#1A0A00]/10 hover:border-[#C84B11]/30"}`}>
                <input
                  type="radio"
                  name="order"
                  value={o.id}
                  checked={selectedOrder === o.id}
                  onChange={() => setSelectedOrder(o.id)}
                  className="mt-1 accent-[#C84B11]"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-[#C84B11] text-sm">{o.id}</span>
                    <span className="font-bold text-[#1A0A00]">₹{o.total}</span>
                  </div>
                  <p className="text-[#1A0A00]/70 text-sm mt-0.5">{o.items}</p>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-[#1A0A00]/40 text-xs">{o.date}</p>
                    <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full font-medium">✓ {o.status}</span>
                  </div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Reason */}
        <div>
          <label className="text-sm font-semibold text-[#1A0A00] mb-2 block">Reason for Refund *</label>
          <select
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full border border-[#1A0A00]/20 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#C84B11] transition-colors bg-white appearance-none"
          >
            <option value="">Select a reason...</option>
            {REASONS.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>

        {/* Description */}
        <div>
          <label className="text-sm font-semibold text-[#1A0A00] mb-2 block">Describe the Issue</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Please provide more details about your issue..."
            rows={4}
            className="w-full border border-[#1A0A00]/20 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#C84B11] transition-colors resize-none"
          />
        </div>

        {/* Contact */}
        <div>
          <label className="text-sm font-semibold text-[#1A0A00] mb-2 block">Contact Number / Email *</label>
          <input
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            placeholder="Phone or email for follow-up"
            className="w-full border border-[#1A0A00]/20 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#C84B11] transition-colors"
          />
        </div>

        <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4">
          <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
          <p className="text-amber-700 text-sm">Refund requests are processed within 24–48 hours. Refunds are issued via the original payment method.</p>
        </div>

        <button
          onClick={submit}
          disabled={loading}
          className="w-full bg-[#C84B11] hover:bg-[#a83d0e] text-white font-bold py-3.5 rounded-xl transition-all hover:scale-105 disabled:opacity-60"
        >
          {loading ? "Submitting..." : "Submit Refund Request"}
        </button>
      </div>
    </div>
  );
}
