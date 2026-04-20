"use client";
import Image from "next/image";
import Link from "next/link";
import { Star, Clock, MapPin, Phone, Tag, ChevronRight, Flame, Gift } from "lucide-react";
import { menuItems } from "@/lib/menuData";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/components/Toast";

const highlights = menuItems.slice(0, 6);

export default function HomePage() {
  const { addToCart } = useCart();
  const toast = useToast();

  const handleAdd = (item: (typeof menuItems)[0]) => {
    addToCart(item);
    toast(`${item.name} added to cart! 🛒`, "success");
  };

  const day = new Date().getDay();
  const isBOGODay = [0, 3, 6].includes(day); // Sun=0, Wed=3, Sat=6

  return (
    <div className="font-['DM_Sans']">
      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="relative bg-[#1A0A00] overflow-hidden min-h-[92vh] flex items-center">
        {/* Background image */}
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1400&q=80"
            alt="Café interior"
            fill
            className="object-cover opacity-25"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1A0A00] via-[#1A0A00]/80 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <div>
            {/* Open now badge */}
            <div className="inline-flex items-center gap-2 bg-green-500/20 border border-green-400/40 text-green-300 px-4 py-1.5 rounded-full text-sm font-medium mb-6">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              Open Now · 9:00 AM – 9:30 PM
            </div>

            <h1 className="font-['Playfair_Display'] text-5xl md:text-6xl font-bold text-[#FFF8EE] leading-tight mb-4">
              The Khao Piyo<br />
              <span className="text-[#E8A020]">Café</span>
            </h1>
            <p className="text-[#FFF8EE]/70 text-lg mb-6 max-w-md">
              Fast food done right — fresh pizzas, sizzling wraps, refreshing mocktails & more. Served with love in Mehatpur, Punjab.
            </p>

            {/* Rating */}
            <div className="flex items-center gap-3 mb-8">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-[#E8A020] fill-[#E8A020]" />
                ))}
              </div>
              <span className="text-[#FFF8EE] font-bold">5.0</span>
              <span className="text-[#FFF8EE]/50 text-sm">(21 reviews)</span>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3">
              <Link href="/menu" className="bg-[#C84B11] hover:bg-[#a83d0e] text-white font-semibold px-7 py-3 rounded-xl transition-all hover:scale-105 shadow-lg shadow-[#C84B11]/30 flex items-center gap-2">
                Order Now <ChevronRight className="w-4 h-4" />
              </Link>
              <Link href="/locations" className="border border-[#E8A020]/50 text-[#E8A020] hover:bg-[#E8A020]/10 font-semibold px-7 py-3 rounded-xl transition-all flex items-center gap-2">
                <MapPin className="w-4 h-4" /> Find Us
              </Link>
            </div>
          </div>

          {/* Right — info card */}
          <div className="space-y-4">
            {/* BOGO Banner */}
            {isBOGODay && (
              <div className="bg-gradient-to-r from-[#C84B11] to-[#E8A020] rounded-2xl p-5 text-white shadow-2xl animate-pulse">
                <div className="flex items-center gap-2 mb-1">
                  <Flame className="w-5 h-5" />
                  <span className="font-bold text-lg uppercase tracking-wide">Today&apos;s BOGO Deal!</span>
                </div>
                <p className="opacity-90 text-sm">Buy 1 Get 1 FREE on all Pizzas today! Use code:</p>
                <code className="bg-white/20 px-3 py-1 rounded-lg font-mono font-bold tracking-widest mt-2 inline-block">BOGOPIZZA</code>
              </div>
            )}

            {/* Promo codes */}
            <div className="bg-white/5 border border-white/10 backdrop-blur-sm rounded-2xl p-5 space-y-3">
              <div className="flex items-center gap-2 text-[#E8A020] font-semibold mb-1">
                <Gift className="w-5 h-5" /> Active Promo Codes
              </div>
              {[
                { code: "BOGOPIZZA", desc: "50% off Pizzas (Wed/Sat/Sun)" },
                { code: "FIRST20", desc: "20% off your first order" },
                { code: "MOJITO600", desc: "₹60 off with Mojito in cart" },
              ].map((p) => (
                <div key={p.code} className="flex items-center justify-between bg-white/5 rounded-xl px-4 py-2.5">
                  <div>
                    <code className="text-[#E8A020] font-mono font-bold text-sm">{p.code}</code>
                    <p className="text-[#FFF8EE]/60 text-xs mt-0.5">{p.desc}</p>
                  </div>
                  <Tag className="w-4 h-4 text-[#E8A020]/50" />
                </div>
              ))}
            </div>

            {/* Quick info */}
            <div className="bg-white/5 border border-white/10 backdrop-blur-sm rounded-2xl p-5 grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-[#E8A020]"><Clock className="w-4 h-4" /><span className="text-xs font-semibold">Hours</span></div>
                <p className="text-[#FFF8EE] text-sm">9:00 AM – 9:30 PM</p>
                <p className="text-[#FFF8EE]/50 text-xs">Open 7 days a week</p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-[#E8A020]"><Phone className="w-4 h-4" /><span className="text-xs font-semibold">Call Us</span></div>
                <a href="tel:07743023125" className="text-[#FFF8EE] text-sm hover:text-[#E8A020]">077430 23125</a>
                <a href="tel:6284462783" className="text-[#FFF8EE]/50 text-xs block hover:text-[#E8A020]">62844-62783</a>
              </div>
              <div className="col-span-2 space-y-1">
                <div className="flex items-center gap-2 text-[#E8A020]"><MapPin className="w-4 h-4" /><span className="text-xs font-semibold">Address</span></div>
                <p className="text-[#FFF8EE] text-sm">Parjian Road, Mehatpur, Punjab 144041</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Menu Highlights ──────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-10">
          <p className="text-[#C84B11] font-semibold text-sm uppercase tracking-widest mb-2">Fresh & Delicious</p>
          <h2 className="font-['Playfair_Display'] text-4xl font-bold text-[#1A0A00]">Menu Highlights</h2>
          <p className="text-[#1A0A00]/60 mt-2">Handpicked favourites from our kitchen</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {highlights.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group hover:-translate-y-1">
              <div className="relative h-52 overflow-hidden">
                <Image src={item.image} alt={item.name} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute top-3 left-3">
                  <span className={`w-5 h-5 rounded-sm border-2 ${item.isVeg ? "border-green-600 bg-white" : "border-red-600 bg-white"} flex items-center justify-center`}>
                    <span className={`w-2.5 h-2.5 rounded-full ${item.isVeg ? "bg-green-500" : "bg-red-500"}`} />
                  </span>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-[#1A0A00] text-lg">{item.name}</h3>
                <p className="text-[#1A0A00]/60 text-sm mt-1 line-clamp-2">{item.description}</p>
                <div className="flex items-center justify-between mt-4">
                  <span className="text-[#C84B11] font-bold text-xl">₹{item.price}</span>
                  <button
                    onClick={() => handleAdd(item)}
                    className="bg-[#C84B11] hover:bg-[#a83d0e] text-white text-sm font-semibold px-4 py-1.5 rounded-lg transition-all hover:scale-105"
                  >
                    + Add
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link href="/menu" className="inline-flex items-center gap-2 bg-[#1A0A00] text-[#E8A020] font-semibold px-8 py-3 rounded-xl hover:bg-[#2d1200] transition-all">
            View Full Menu <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* ── Why Us ──────────────────────────────────── */}
      <section className="bg-[#1A0A00] py-16">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="font-['Playfair_Display'] text-3xl font-bold text-[#FFF8EE] mb-10">Why Choose Us?</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: "🍕", label: "Fresh Ingredients", desc: "Locally sourced, made daily" },
              { icon: "⚡", label: "Fast Delivery", desc: "30–45 mins to your door" },
              { icon: "💰", label: "Great Value", desc: "₹200–400 per person" },
              { icon: "⭐", label: "5 Star Rated", desc: "21 happy reviews & counting" },
            ].map((w) => (
              <div key={w.label} className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all">
                <div className="text-4xl mb-3">{w.icon}</div>
                <h3 className="text-[#E8A020] font-semibold mb-1">{w.label}</h3>
                <p className="text-[#FFF8EE]/60 text-sm">{w.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
