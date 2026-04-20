"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingCart, Menu, X, ChefHat, UserCircle } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/menu", label: "Menu" },
  { href: "/reviews", label: "Reviews" },
  { href: "/chat", label: "Chat" },
  { href: "/locations", label: "Location" },
];

export default function Navbar() {
  const pathname = usePathname();
  const { totalItems } = useCart();
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-[#1A0A00] shadow-lg shadow-black/30">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <ChefHat className="text-[#E8A020] w-7 h-7" />
          <div className="leading-tight">
            <span className="text-[#E8A020] font-bold text-lg font-['Playfair_Display']">The Khao Piyo</span>
            <span className="text-[#FFF8EE]/60 text-xs block leading-none">Café</span>
          </div>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                pathname === l.href
                  ? "bg-[#C84B11] text-white"
                  : "text-[#FFF8EE]/80 hover:text-[#E8A020] hover:bg-white/5"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </div>

        {/* Cart + Hamburger */}
        <div className="flex items-center gap-3">
          <Link href="/cart" className="relative p-2 text-[#FFF8EE] hover:text-[#E8A020] transition-colors">
            <ShoppingCart className="w-6 h-6" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#C84B11] text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center animate-pulse">
                {totalItems}
              </span>
            )}
          </Link>
          
          {user ? (
            <button onClick={logout} className="hidden md:flex items-center gap-2 bg-[#1A0A00] text-[#E8A020] border border-[#E8A020]/20 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-white/5 transition-all">
              <UserCircle className="w-4 h-4" /> Sign Out
            </button>
          ) : (
            <Link href="/login" className="hidden md:inline-block bg-[#C84B11] text-white px-5 py-2 rounded-xl text-sm font-semibold hover:bg-[#a83d0e] transition-all">
              Login
            </Link>
          )}

          <button
            className="md:hidden p-2 text-[#FFF8EE] hover:text-[#E8A020]"
            onClick={() => setOpen(!open)}
          >
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-[#1A0A00] border-t border-white/10 px-4 py-3 space-y-1">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className={`block px-4 py-2.5 rounded-lg text-sm font-medium ${
                pathname === l.href ? "bg-[#C84B11] text-white" : "text-[#FFF8EE]/80 hover:bg-white/5"
              }`}
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/cart"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-[#E8A020] hover:bg-white/5"
          >
            <ShoppingCart className="w-4 h-4" /> Cart {totalItems > 0 && `(${totalItems})`}
          </Link>

          {user ? (
            <button
              onClick={() => { logout(); setOpen(false); }}
              className="w-full text-left flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-red-400 hover:bg-white/5"
            >
              Sign Out
            </button>
          ) : (
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="block px-4 py-2.5 rounded-lg text-sm font-medium text-[#C84B11] hover:bg-white/5"
            >
              Login
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
