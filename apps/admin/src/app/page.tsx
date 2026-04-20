"use client";
import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ShoppingBag, MessageCircle, RefreshCw, RotateCcw, LogOut, CheckCircle, XCircle, Truck, Clock, Send, ChefHat, Users, DollarSign, MapPin } from "lucide-react";
import type { Order, ChatSession, RefundRequest, LoginRecord } from "@/lib/db";

type Tab = "orders" | "delivery" | "chat" | "refunds" | "logins";

const STATUS_CONFIG = {
  pending:   { label: "Pending",   color: "bg-yellow-100 text-yellow-700 border-yellow-200",  icon: Clock },
  approved:  { label: "Approved",  color: "bg-blue-100 text-blue-700 border-blue-200",        icon: CheckCircle },
  cancelled: { label: "Cancelled", color: "bg-red-100 text-red-700 border-red-200",           icon: XCircle },
  delivered: { label: "Delivered", color: "bg-green-100 text-green-700 border-green-200",     icon: Truck },
};

export default function AdminPage() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("orders");
  const [orders, setOrders] = useState<Order[]>([]);
  const [chats, setChats] = useState<ChatSession[]>([]);
  const [refunds, setRefunds] = useState<RefundRequest[]>([]);
  const [logins, setLogins] = useState<LoginRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [openChat, setOpenChat] = useState<ChatSession | null>(null);
  const [replyText, setReplyText] = useState("");
  const [orderNote, setOrderNote] = useState<Record<string, string>>({});

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [o, c, r, l] = await Promise.all([
        fetch("/api/orders").then((r) => r.json()),
        fetch("/api/chat").then((r) => r.json()),
        fetch("/api/refunds").then((r) => r.json()),
        fetch("/api/logins").then((r) => r.json()),
      ]);
      setOrders(Array.isArray(o) ? o : []);
      setChats(Array.isArray(c) ? c : []);
      setRefunds(Array.isArray(r) ? r : []);
      setLogins(Array.isArray(l) ? l : []);
    } catch {}
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const updateOrder = async (id: string, status: Order["status"]) => {
    await fetch(`/api/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, adminNote: orderNote[id] ?? "" }),
    });
    fetchAll();
  };

  const sendAdminReply = async () => {
    if (!openChat || !replyText.trim()) return;
    const updatedSession: ChatSession = {
      ...openChat,
      messages: [...openChat.messages, { role: "admin", text: replyText, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }],
    };
    await fetch("/api/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(updatedSession) });
    setOpenChat(updatedSession);
    setReplyText("");
    fetchAll();
  };

  const updateRefund = async (id: string, status: "approved" | "rejected") => {
    await fetch(`/api/refunds`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    fetchAll();
  };

  const stats = {
    total: orders.length,
    pending: orders.filter((o) => o.status === "pending").length,
    revenue: orders.filter((o) => o.status !== "cancelled").reduce((s, o) => s + o.total, 0),
    openChats: chats.filter((c) => c.status === "open").length,
  };


  // ── Dashboard ──────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50 font-['DM_Sans']">
      {/* Admin header */}
      <div className="bg-[#1A0A00] px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <ChefHat className="w-7 h-7 text-[#E8A020]" />
          <div>
            <span className="text-[#E8A020] font-['Playfair_Display'] font-bold text-lg">Khao Piyo Admin</span>
            <p className="text-[#FFF8EE]/50 text-xs">Restaurant Management Dashboard</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={fetchAll} disabled={loading} className="text-[#FFF8EE]/60 hover:text-[#E8A020] transition-colors p-2">
            <RefreshCw className={`w-5 h-5 ${loading ? "animate-spin" : ""}`} />
          </button>
          <button onClick={logout} className="flex items-center gap-2 text-[#FFF8EE]/60 hover:text-red-400 transition-colors text-sm">
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6">
        {[
          { icon: ShoppingBag, label: "Total Orders", value: stats.total, color: "text-[#C84B11]" },
          { icon: Clock, label: "Pending", value: stats.pending, color: "text-yellow-600" },
          { icon: DollarSign, label: "Revenue", value: `₹${stats.revenue}`, color: "text-green-600" },
          { icon: Users, label: "Open Chats", value: stats.openChats, color: "text-blue-600" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl p-5 shadow-sm">
            <s.icon className={`w-6 h-6 ${s.color} mb-2`} />
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-gray-500 text-sm mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="px-6 relative overflow-x-auto">
        <div className="flex gap-2 border-b border-gray-200 whitespace-nowrap min-w-max">
          {(["orders", "delivery", "chat", "refunds", "logins"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-5 py-2.5 font-semibold text-sm capitalize border-b-2 transition-all -mb-px ${tab === t ? "border-[#C84B11] text-[#C84B11]" : "border-transparent text-gray-500 hover:text-[#1A0A00]"}`}
            >
              {t === "orders" ? `🍕 Orders (${orders.length})` : 
               t === "delivery" ? `🛵 Delivery (${orders.filter(o => o.status === 'approved' || o.status === 'pending').length})` :
               t === "chat" ? `💬 Chats (${chats.length})` : 
               t === "refunds" ? `↩️ Refunds (${refunds.length})` : 
               `👤 Logins (${logins.length})`}
            </button>
          ))}
        </div>
      </div>

      <div className="p-6">
        {/* ── ORDERS TAB ── */}
        {tab === "orders" && (
          <div className="space-y-4">
            {orders.length === 0 && <p className="text-center text-gray-400 py-12">No orders yet. Orders will appear here when customers place them.</p>}
            {orders.map((order) => {
              const sc = STATUS_CONFIG[order.status];
              return (
                <div key={order.id} className="bg-white rounded-2xl shadow-sm overflow-hidden">
                  {/* Order header */}
                  <div className="flex items-center justify-between p-5 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <div>
                        <span className="font-mono font-bold text-[#C84B11]">{order.id}</span>
                        <p className="text-gray-500 text-xs mt-0.5">{new Date(order.createdAt).toLocaleString("en-IN")}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${sc.color}`}>{sc.label}</span>
                      <span className="font-bold text-[#1A0A00]">₹{order.total}</span>
                    </div>
                  </div>

                  {/* Order body */}
                  <div className="p-5 grid md:grid-cols-2 gap-5">
                    <div>
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Items Ordered</p>
                      <div className="space-y-2">
                        {order.items.map((item) => (
                          <div key={item.id} className="flex items-center gap-3">
                            <div className="relative w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
                              <Image src={item.image} alt={item.name} fill className="object-cover" />
                            </div>
                            <span className="text-sm text-[#1A0A00]">{item.name} × {item.qty}</span>
                            <span className="ml-auto text-sm font-medium text-[#C84B11]">₹{item.price * item.qty}</span>
                          </div>
                        ))}
                      </div>
                      <div className="mt-3 pt-3 border-t border-gray-100 text-sm space-y-1">
                        {order.promoCode && <div className="flex justify-between text-green-600"><span>Promo: {order.promoCode}</span><span>-₹{order.discount}</span></div>}
                        <div className="flex justify-between font-bold text-[#1A0A00]"><span>Total</span><span>₹{order.total}</span></div>
                      </div>
                    </div>

                    <div>
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Customer Details</p>
                      <div className="space-y-1 text-sm text-[#1A0A00]">
                        <p><span className="text-gray-400">Name:</span> {order.customerName}</p>
                        {order.phone && <p><span className="text-gray-400">Phone:</span> {order.phone}</p>}
                        <p><span className="text-gray-400">Address:</span> {order.address}</p>
                      </div>

                      {/* Admin note */}
                      <div className="mt-3">
                        <input
                          value={orderNote[order.id] ?? order.adminNote ?? ""}
                          onChange={(e) => setOrderNote((prev) => ({ ...prev, [order.id]: e.target.value }))}
                          placeholder="Add admin note..."
                          className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs outline-none focus:border-[#C84B11] transition-colors"
                        />
                      </div>

                      {/* Action buttons */}
                      <div className="flex flex-wrap gap-2 mt-3">
                        <button onClick={() => updateOrder(order.id, "approved")} disabled={order.status === "approved"} className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white text-xs font-semibold px-3 py-2 rounded-xl transition-all">
                          <CheckCircle className="w-3.5 h-3.5" /> Approve
                        </button>
                        <button onClick={() => updateOrder(order.id, "delivered")} disabled={order.status === "delivered"} className="flex items-center gap-1.5 bg-green-600 hover:bg-green-700 disabled:opacity-40 text-white text-xs font-semibold px-3 py-2 rounded-xl transition-all">
                          <Truck className="w-3.5 h-3.5" /> Mark Delivered
                        </button>
                        <button onClick={() => updateOrder(order.id, "cancelled")} disabled={order.status === "cancelled"} className="flex items-center gap-1.5 bg-red-500 hover:bg-red-600 disabled:opacity-40 text-white text-xs font-semibold px-3 py-2 rounded-xl transition-all">
                          <XCircle className="w-3.5 h-3.5" /> Cancel
                        </button>
                        <button onClick={() => updateOrder(order.id, "pending")} className="flex items-center gap-1.5 border border-gray-300 text-gray-600 hover:bg-gray-50 text-xs font-semibold px-3 py-2 rounded-xl transition-all">
                          <RotateCcw className="w-3.5 h-3.5" /> Reset
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── DELIVERY TAB ── */}
        {tab === "delivery" && (
          <div className="space-y-4">
            {orders.filter(o => o.status === 'approved' || o.status === 'pending').length === 0 && <p className="text-center text-gray-400 py-12">No orders pending delivery.</p>}
            {orders.filter(o => o.status === 'approved' || o.status === 'pending').map((order) => {
              const sc = STATUS_CONFIG[order.status];
              return (
                <div key={order.id} className="bg-white rounded-2xl shadow-sm overflow-hidden p-5 border-l-4 border-[#C84B11]">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-mono font-bold text-[#C84B11] text-lg">{order.id}</span>
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${sc.color}`}>{sc.label}</span>
                      </div>
                      <p className="text-gray-500 text-sm">{new Date(order.createdAt).toLocaleString("en-IN")}</p>
                      
                      <div className="mt-4 space-y-1">
                        <p className="font-semibold text-[#1A0A00] text-lg flex items-center gap-2">
                          <Users className="w-5 h-5 text-gray-400" /> {order.customerName}
                        </p>
                        {order.phone && (
                          <p className="font-bold text-[#C84B11] text-2xl mt-1 py-1 px-3 bg-red-50 rounded-lg inline-block border border-red-100">
                            📞 {order.phone}
                          </p>
                        )}
                        <p className="text-gray-600 mt-2 flex items-start gap-2">
                          <MapPin className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" /> 
                          <span className="font-medium">{order.address}</span>
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex flex-col justify-end bg-gray-50 p-4 rounded-xl border border-gray-100">
                       <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Order Items</p>
                       <ul className="text-sm font-medium space-y-1 mb-4">
                         {order.items.map(item => (
                           <li key={item.id}>• {item.qty}x {item.name}</li>
                         ))}
                       </ul>
                       <button onClick={() => updateOrder(order.id, "delivered")} className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold px-5 py-3 rounded-xl transition-all shadow-lg shadow-green-600/20">
                          <Truck className="w-5 h-5" /> Mark Delivered
                       </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── CHATS TAB ── */}
        {tab === "chat" && (
          <div className="grid md:grid-cols-2 gap-4">
            {/* Sessions list */}
            <div className="space-y-3">
              <h3 className="font-semibold text-[#1A0A00] text-sm uppercase tracking-wider">Customer Sessions</h3>
              {chats.length === 0 && <p className="text-gray-400 text-sm py-8 text-center">No chat sessions yet</p>}
              {chats.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setOpenChat(s)}
                  className={`w-full text-left bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-all ${openChat?.id === s.id ? "ring-2 ring-[#C84B11]" : ""}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#C84B11] to-[#E8A020] flex items-center justify-center text-white text-sm font-bold">
                        {s.customerName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-[#1A0A00] text-sm">{s.customerName}</p>
                        <p className="text-gray-400 text-xs">{s.messages.length} messages</p>
                      </div>
                    </div>
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${s.status === "open" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>
                      {s.status}
                    </span>
                  </div>
                  {s.messages.length > 0 && (
                    <p className="text-gray-400 text-xs mt-2 truncate">{s.messages[s.messages.length - 1].text}</p>
                  )}
                </button>
              ))}
            </div>

            {/* Chat window */}
            {openChat ? (
              <div className="bg-white rounded-2xl shadow-sm flex flex-col h-[500px]">
                <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-[#1A0A00]">{openChat.customerName}</p>
                    <p className="text-gray-400 text-xs">Session: {openChat.sessionId}</p>
                  </div>
                  <MessageCircle className="w-5 h-5 text-[#C84B11]" />
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {openChat.messages.map((m, i) => (
                    <div key={i} className={`flex ${m.role === "user" ? "justify-start" : "justify-end"}`}>
                      <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${
                        m.role === "user" ? "bg-gray-100 text-[#1A0A00] rounded-bl-sm" :
                        m.role === "admin" ? "bg-[#C84B11] text-white rounded-br-sm" :
                        "bg-[#1A0A00] text-[#FFF8EE] rounded-br-sm"
                      }`}>
                        <p>{m.text}</p>
                        <p className="text-xs opacity-60 mt-0.5">{m.role === "admin" ? "Admin · " : ""}{m.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-4 border-t border-gray-100 flex gap-2">
                  <input
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendAdminReply()}
                    placeholder="Reply to customer..."
                    className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-[#C84B11] transition-colors"
                  />
                  <button onClick={sendAdminReply} className="bg-[#C84B11] text-white p-2.5 rounded-xl hover:bg-[#a83d0e] transition-all">
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-sm flex items-center justify-center h-[500px]">
                <div className="text-center text-gray-300">
                  <MessageCircle className="w-12 h-12 mx-auto mb-3" />
                  <p>Select a chat session</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── REFUNDS TAB ── */}
        {tab === "refunds" && (
          <div className="space-y-4">
            {refunds.length === 0 && <p className="text-center text-gray-400 py-12">No refund requests. Requests will appear here when customers submit them.</p>}
            {refunds.map((r) => (
              <div key={r.id} className="bg-white rounded-2xl shadow-sm p-5">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <span className="font-mono font-bold text-[#C84B11]">{r.id}</span>
                    <p className="text-gray-400 text-xs mt-0.5">{new Date(r.createdAt).toLocaleString("en-IN")}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                    r.status === "pending" ? "bg-yellow-100 text-yellow-700 border-yellow-200" :
                    r.status === "approved" ? "bg-green-100 text-green-700 border-green-200" :
                    "bg-red-100 text-red-700 border-red-200"
                  }`}>{r.status}</span>
                </div>
                <div className="grid md:grid-cols-3 gap-4 text-sm mb-4">
                  <div><span className="text-gray-400 block text-xs">Order ID</span><span className="font-medium">{r.orderId}</span></div>
                  <div><span className="text-gray-400 block text-xs">Reason</span><span className="font-medium">{r.reason}</span></div>
                  <div><span className="text-gray-400 block text-xs">Contact</span><span className="font-medium">{r.contact}</span></div>
                </div>
                {r.description && <p className="text-gray-600 text-sm bg-gray-50 rounded-xl p-3 mb-4">{r.description}</p>}
                {r.status === "pending" && (
                  <div className="flex gap-2">
                    <button onClick={() => updateRefund(r.id, "approved")} className="flex items-center gap-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-all">
                      <CheckCircle className="w-3.5 h-3.5" /> Approve Refund
                    </button>
                    <button onClick={() => updateRefund(r.id, "rejected")} className="flex items-center gap-1.5 bg-red-500 hover:bg-red-600 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-all">
                      <XCircle className="w-3.5 h-3.5" /> Reject
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* ── LOGINS TAB ── */}
        {tab === "logins" && (
          <div className="space-y-4">
            <h3 className="font-semibold text-[#1A0A00] text-sm uppercase tracking-wider mb-4">Website Logins</h3>
            {logins.length === 0 && <p className="text-center text-gray-400 py-12">No logins recorded yet.</p>}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-[#1A0A00] text-[#FFF8EE]">
                    <tr>
                      <th className="px-6 py-4 font-semibold uppercase text-xs tracking-wider">Email</th>
                      <th className="px-6 py-4 font-semibold uppercase text-xs tracking-wider">Time</th>
                      <th className="px-6 py-4 font-semibold uppercase text-xs tracking-wider hidden md:table-cell">Browser/Agent</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {logins.map((l) => (
                      <tr key={l.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 font-medium text-[#C84B11]">{l.email}</td>
                        <td className="px-6 py-4 text-gray-500 whitespace-nowrap">{new Date(l.createdAt).toLocaleString("en-IN")}</td>
                        <td className="px-6 py-4 text-gray-400 text-xs hidden md:table-cell max-w-xs truncate" title={l.userAgent}>{l.userAgent}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
