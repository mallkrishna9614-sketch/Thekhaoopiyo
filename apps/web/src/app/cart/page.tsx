"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Trash2, Plus, Minus, Tag, MapPin, CheckCircle, ShoppingBag, Mail } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/Toast";
import { PROMO_CODES, menuItems } from "@/lib/menuData";

const GST_RATE = 0.05;

export default function CartPage() {
  const { cart, addToCart, updateQty, removeFromCart, clearCart, subtotal } = useCart();
  const toast = useToast();
  const [promoInput, setPromoInput] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<null | { code: string; discount: number; type: "percent" | "flat"; description: string }>(null);
  const [address, setAddress] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [orderId, setOrderId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const router = require("next/navigation").useRouter();

  const discount = appliedPromo
    ? appliedPromo.type === "percent"
      ? Math.round((subtotal * appliedPromo.discount) / 100)
      : appliedPromo.discount
    : 0;
  const discountedSubtotal = subtotal - discount;
  const gst = Math.round(discountedSubtotal * GST_RATE);
  const total = discountedSubtotal + gst;

  const applyPromo = () => {
    const code = promoInput.trim().toUpperCase();
    if (PROMO_CODES[code]) {
      setAppliedPromo({ code, ...PROMO_CODES[code] });
      toast(`Promo code "${code}" applied! 🎉`, "success");
    } else {
      toast("Invalid promo code", "error");
    }
    setPromoInput("");
  };

  const hasPizza = cart.some((c) => {
    const item = menuItems.find((m) => m.id === c.id);
    return item?.category === "pizza";
  });

  const suggestions = hasPizza
    ? menuItems.filter((m) => m.category === "burgers" || m.category === "starters" || m.category === "drinks").slice(0, 2)
    : [];

  const placeOrder = async () => {
    if (!user) {
      toast("Please login to place an order", "error");
      router.push("/login");
      return;
    }
    if (!address.trim()) { toast("Please enter delivery address", "error"); return; }
    if (!customerName.trim()) { toast("Please enter your name", "error"); return; }
    if (cart.length === 0) { toast("Cart is empty!", "error"); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cart.map((c) => ({ id: c.id, name: c.name, price: c.price, qty: c.qty, image: c.image })),
          subtotal, gst, discount, total,
          promoCode: appliedPromo?.code ?? "",
          address, customerName, email: user.email,
        }),
      });
      const data = await res.json();
      setOrderId(data.id);
      clearCart();
      toast("Order placed successfully! 🎉", "success");
    } catch {
      toast("Failed to place order. Try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  if (orderId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFF8EE] px-4">
        <div className="bg-white rounded-3xl shadow-2xl p-10 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>
          <h2 className="font-['Playfair_Display'] text-3xl font-bold text-[#1A0A00] mb-2">Order Placed!</h2>
          <p className="text-[#1A0A00]/60 mb-4">Your delicious food is being prepared 🍕</p>
          <div className="bg-[#FFF8EE] rounded-xl p-4 mb-6">
            <p className="text-sm text-[#1A0A00]/60">Order ID</p>
            <p className="font-mono font-bold text-[#C84B11] text-xl">{orderId}</p>
          </div>
          <p className="text-sm text-[#1A0A00]/50 mb-6">Expected delivery: 30–45 minutes</p>
          <Link href="/menu" className="block bg-[#C84B11] text-white font-semibold py-3 rounded-xl hover:bg-[#a83d0e] transition-all">
            Order More
          </Link>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFF8EE] px-4">
        <div className="text-center">
          <ShoppingBag className="w-16 h-16 text-[#1A0A00]/20 mx-auto mb-4" />
          <h2 className="font-['Playfair_Display'] text-2xl font-bold text-[#1A0A00] mb-2">Your cart is empty</h2>
          <p className="text-[#1A0A00]/50 mb-6">Add some delicious items from our menu</p>
          <Link href="/menu" className="bg-[#C84B11] text-white font-semibold px-8 py-3 rounded-xl hover:bg-[#a83d0e] transition-all">
            Browse Menu
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 font-['DM_Sans']">
      <div className="mb-8">
        <p className="text-[#C84B11] font-semibold text-sm uppercase tracking-widest mb-1">Review Your Order</p>
        <h1 className="font-['Playfair_Display'] text-4xl font-bold text-[#1A0A00]">Your Cart</h1>
      </div>

      <div className="grid lg:grid-cols-5 gap-8">
        {/* Cart items */}
        <div className="lg:col-span-3 space-y-4">
          {cart.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl p-4 flex gap-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                <Image src={item.image} alt={item.name} fill className="object-cover" />
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-[#1A0A00]">{item.name}</h3>
                    <p className="text-[#1A0A00]/50 text-sm">₹{item.price} each</p>
                  </div>
                  <button onClick={() => { removeFromCart(item.id); toast(`${item.name} removed`, "info"); }} className="text-red-400 hover:text-red-600 transition-colors p-1">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center gap-1 bg-[#FFF8EE] rounded-xl border border-[#1A0A00]/10 overflow-hidden">
                    <button onClick={() => updateQty(item.id, item.qty - 1)} className="p-2 hover:bg-[#1A0A00]/5 transition-colors">
                      <Minus className="w-3.5 h-3.5 text-[#C84B11]" />
                    </button>
                    <span className="px-3 font-bold text-sm text-[#1A0A00]">{item.qty}</span>
                    <button onClick={() => updateQty(item.id, item.qty + 1)} className="p-2 hover:bg-[#1A0A00]/5 transition-colors">
                      <Plus className="w-3.5 h-3.5 text-[#C84B11]" />
                    </button>
                  </div>
                  <span className="font-bold text-[#C84B11]">₹{item.price * item.qty}</span>
                </div>
              </div>
            </div>
          ))}

          {/* Suggestions */}
          {suggestions.length > 0 && (
            <div className="mt-8 pt-8 border-t border-[#1A0A00]/10">
              <p className="text-[#C84B11] font-semibold text-sm uppercase tracking-widest mb-1">Pairs nicely with Pizza</p>
              <h2 className="font-['Playfair_Display'] text-2xl font-bold text-[#1A0A00] mb-4">You might also like</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {suggestions.map((item) => {
                  const inCart = cart.find((c) => c.id === item.id);
                  return (
                    <div key={item.id} className="bg-white rounded-2xl p-4 flex gap-3 shadow-sm border border-[#1A0A00]/5 hover:shadow-md transition-shadow">
                      <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                        <Image src={item.image} alt={item.name} fill className="object-cover" />
                      </div>
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <h3 className="font-semibold text-[#1A0A00] text-sm leading-tight">{item.name}</h3>
                          <p className="text-[#C84B11] font-bold text-sm mt-0.5">₹{item.price}</p>
                        </div>
                        {inCart ? (
                            <span className="text-xs font-semibold text-green-600 self-start mt-2">In Cart ({inCart.qty})</span>
                        ) : (
                          <button
                            onClick={() => { addToCart(item); toast(`${item.name} added to cart!`, "success"); }}
                            className="text-xs bg-[#1A0A00] hover:bg-[#2d1200] text-[#E8A020] px-3 py-1.5 rounded-lg font-medium self-start mt-2 transition-colors flex items-center gap-1"
                          >
                            <Plus className="w-3 h-3" /> Add
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Summary */}
        <div className="lg:col-span-2 space-y-4">
          {/* Promo */}
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <h3 className="font-semibold text-[#1A0A00] mb-3 flex items-center gap-2"><Tag className="w-4 h-4 text-[#C84B11]" /> Promo Code</h3>
            {appliedPromo ? (
              <div className="bg-green-50 border border-green-200 rounded-xl p-3 flex items-center justify-between">
                <div>
                  <code className="text-green-700 font-bold">{appliedPromo.code}</code>
                  <p className="text-green-600 text-xs">{appliedPromo.description}</p>
                </div>
                <button onClick={() => setAppliedPromo(null)} className="text-red-400 hover:text-red-600 text-sm">✕</button>
              </div>
            ) : (
              <div className="flex gap-2">
                <input
                  value={promoInput}
                  onChange={(e) => setPromoInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && applyPromo()}
                  placeholder="Enter code..."
                  className="flex-1 border border-[#1A0A00]/20 rounded-xl px-3 py-2 text-sm outline-none focus:border-[#C84B11] transition-colors"
                />
                <button onClick={applyPromo} className="bg-[#C84B11] text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-[#a83d0e] transition-all">
                  Apply
                </button>
              </div>
            )}
          </div>

          {/* Delivery info */}
          <div className="bg-white rounded-2xl p-5 shadow-sm space-y-3">
            <h3 className="font-semibold text-[#1A0A00] flex items-center gap-2"><MapPin className="w-4 h-4 text-[#C84B11]" /> Delivery Details</h3>
            <input
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Your name *"
              className="w-full border border-[#1A0A00]/20 rounded-xl px-3 py-2 text-sm outline-none focus:border-[#C84B11] transition-colors"
            />
            {user ? (
               <div className="w-full border border-[#1A0A00]/10 bg-gray-50 rounded-xl px-3 py-2 text-sm text-[#1A0A00]/60 select-none flex items-center gap-2">
                 <Mail className="w-4 h-4 text-[#C84B11]" /> {user.email} <span className="text-xs text-green-600 ml-1">(Verified)</span>
               </div>
            ) : (
                <div className="w-full border border-red-200 bg-red-50 rounded-xl px-3 py-2 text-sm text-red-600">
                  Login required to verify email
                </div>
            )}
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Full delivery address *"
              rows={3}
              className="w-full border border-[#1A0A00]/20 rounded-xl px-3 py-2 text-sm outline-none focus:border-[#C84B11] transition-colors resize-none"
            />
          </div>

          {/* Bill */}
          <div className="bg-white rounded-2xl p-5 shadow-sm space-y-2">
            <h3 className="font-semibold text-[#1A0A00] mb-3">Bill Summary</h3>
            <div className="flex justify-between text-sm text-[#1A0A00]/70"><span>Subtotal</span><span>₹{subtotal}</span></div>
            {discount > 0 && <div className="flex justify-between text-sm text-green-600"><span>Discount</span><span>-₹{discount}</span></div>}
            <div className="flex justify-between text-sm text-[#1A0A00]/70"><span>GST (5%)</span><span>₹{gst}</span></div>
            <div className="flex justify-between text-sm text-green-600"><span>Delivery</span><span>FREE 🎉</span></div>
            <div className="border-t border-[#1A0A00]/10 pt-3 flex justify-between font-bold text-[#1A0A00] text-lg">
              <span>Total</span><span className="text-[#C84B11]">₹{total}</span>
            </div>
            <button
              onClick={placeOrder}
              disabled={loading}
              className="w-full bg-[#C84B11] hover:bg-[#a83d0e] disabled:opacity-60 text-white font-bold py-3.5 rounded-xl transition-all hover:scale-105 shadow-lg shadow-[#C84B11]/30 mt-2 text-base flex justify-center items-center gap-2"
            >
              {!user ? "Login to Checkout" : loading ? "Placing Order..." : "Place Order 🍕"}
            </button>
            <p className="text-xs text-center text-[#1A0A00]/40 mt-1">Cash / UPI on delivery</p>
          </div>
        </div>
      </div>
    </div>
  );
}
