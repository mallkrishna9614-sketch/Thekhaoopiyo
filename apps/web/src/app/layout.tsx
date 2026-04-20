import type { Metadata } from "next";
import { Playfair_Display, DM_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { CartProvider } from "@/contexts/CartContext";
import { ToastProvider } from "@/components/Toast";
import { AuthProvider } from "@/contexts/AuthContext";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "The Khao Piyo Café — Mehatpur, Punjab",
  description:
    "Authentic fast food café at Parjian Road, Mehatpur. Pizzas, Burgers, Wraps, Mocktails & more. Open daily 9 AM – 9:30 PM. Order online!",
  keywords: "café mehatpur, khao piyo, fast food punjab, pizza, burger, mojito",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${playfair.variable} ${dmSans.variable}`}>
      <body className="bg-[#FFF8EE] text-[#1A0A00] font-sans antialiased">
        <CartProvider>
          <ToastProvider>
            <AuthProvider>
              <Navbar />
              <main className="min-h-screen">{children}</main>
              <footer className="bg-[#1A0A00] text-[#FFF8EE]/70 text-center text-sm py-6 mt-16">
                <p className="font-['Playfair_Display'] text-[#E8A020] text-lg font-semibold">The Khao Piyo Café</p>
                <p className="mt-1">Parjian Road, Mehatpur, Punjab 144041</p>
                <p className="mt-0.5">📞 077430 23125 · 62844-62783 &nbsp;|&nbsp; ⏰ Daily 9:00 AM – 9:30 PM</p>
                <p className="mt-2 text-xs text-white/30">© 2024 The Khao Piyo Café. All rights reserved.</p>
              </footer>
            </AuthProvider>
          </ToastProvider>
        </CartProvider>
      </body>
    </html>
  );
}
