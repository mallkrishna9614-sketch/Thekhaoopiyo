"use client";
import Image from "next/image";
import { useState } from "react";
import { menuItems } from "@/lib/menuData";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/components/Toast";
import { Plus, Minus } from "lucide-react";

type Category = "all" | "pizza" | "burgers" | "wraps" | "drinks" | "starters" | "mains";

const categories: { id: Category; label: string; emoji: string }[] = [
  { id: "all", label: "All", emoji: "🍽️" },
  { id: "pizza", label: "Pizza", emoji: "🍕" },
  { id: "burgers", label: "Burgers", emoji: "🍔" },
  { id: "wraps", label: "Wraps", emoji: "🌯" },
  { id: "drinks", label: "Drinks", emoji: "🥤" },
  { id: "starters", label: "Starters", emoji: "🥗" },
  { id: "mains", label: "Mains", emoji: "🍲" },
];

export default function MenuPage() {
  const [active, setActive] = useState<Category>("all");
  const { cart, addToCart, updateQty } = useCart();
  const toast = useToast();

  const filtered = active === "all" ? menuItems : menuItems.filter((m) => m.category === active);

  const getQty = (id: string) => cart.find((c) => c.id === id)?.qty ?? 0;

  const handleAdd = (item: (typeof menuItems)[0]) => {
    addToCart(item);
    toast(`${item.name} added to cart! 🛒`, "success");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 font-['DM_Sans']">
      {/* Header */}
      <div className="text-center mb-10">
        <p className="text-[#C84B11] font-semibold text-sm uppercase tracking-widest mb-2">Explore Our Kitchen</p>
        <h1 className="font-['Playfair_Display'] text-4xl md:text-5xl font-bold text-[#1A0A00]">Our Menu</h1>
        <p className="text-[#1A0A00]/60 mt-2 max-w-xl mx-auto">
          Freshly prepared with love — from crispy pizzas to refreshing mocktails
        </p>
      </div>

      {/* Category tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-8 scrollbar-hide">
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setActive(c.id)}
            className={`flex-shrink-0 flex items-center gap-2 px-5 py-2 rounded-xl font-medium text-sm transition-all ${
              active === c.id
                ? "bg-[#C84B11] text-white shadow-lg shadow-[#C84B11]/30"
                : "bg-white text-[#1A0A00]/70 hover:bg-[#FFF8EE] border border-[#1A0A00]/10"
            }`}
          >
            <span>{c.emoji}</span> {c.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {filtered.map((item) => {
          const qty = getQty(item.id);
          return (
            <div key={item.id} className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group hover:-translate-y-1 flex flex-col">
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                {/* Veg/Non-veg indicator */}
                <div className="absolute top-3 left-3">
                  <div className={`w-5 h-5 rounded-sm border-2 bg-white flex items-center justify-center ${item.isVeg ? "border-green-600" : "border-red-600"}`}>
                    <span className={`w-2.5 h-2.5 rounded-full ${item.isVeg ? "bg-green-500" : "bg-red-500"}`} />
                  </div>
                </div>
                {/* Category badge */}
                <div className="absolute top-3 right-3 bg-[#1A0A00]/80 text-[#E8A020] text-xs px-2 py-0.5 rounded-full capitalize backdrop-blur-sm">
                  {item.category}
                </div>
              </div>

              {/* Content */}
              <div className="p-4 flex flex-col flex-1">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-semibold text-[#1A0A00] text-base leading-snug">{item.name}</h3>
                    <span className={`text-xs font-medium mt-0.5 ${item.isVeg ? "text-green-600" : "text-red-600"}`}>
                      {item.isVeg ? "● VEG" : "● NON-VEG"}
                    </span>
                  </div>
                  <span className="text-[#C84B11] font-bold text-xl shrink-0">₹{item.price}</span>
                </div>
                <p className="text-[#1A0A00]/60 text-xs mt-2 line-clamp-2 flex-1">{item.description}</p>

                {/* Cart control */}
                <div className="mt-4">
                  {qty === 0 ? (
                    <button
                      onClick={() => handleAdd(item)}
                      className="w-full bg-[#C84B11] hover:bg-[#a83d0e] text-white font-semibold py-2 rounded-xl transition-all hover:scale-105 text-sm"
                    >
                      + Add to Cart
                    </button>
                  ) : (
                    <div className="flex items-center justify-between bg-[#1A0A00] rounded-xl overflow-hidden">
                      <button
                        onClick={() => updateQty(item.id, qty - 1)}
                        className="p-2.5 text-[#E8A020] hover:bg-white/10 transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="text-white font-bold text-sm px-3">{qty}</span>
                      <button
                        onClick={() => { addToCart(item); toast(`${item.name} quantity updated`, "info"); }}
                        className="p-2.5 text-[#E8A020] hover:bg-white/10 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-20 text-[#1A0A00]/40">
          <p className="text-5xl mb-4">🍽️</p>
          <p className="text-lg font-medium">No items in this category yet</p>
        </div>
      )}
    </div>
  );
}
