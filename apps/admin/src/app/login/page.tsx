"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChefHat } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [pw, setPw] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const login = async () => {
    if (!pw.trim()) return;
    setLoading(true);
    setError(false);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: pw }),
      });
      if (res.ok) {
        router.push("/");
        router.refresh();
      } else {
        setError(true);
        setPw("");
        setTimeout(() => setError(false), 3000);
      }
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1A0A00] flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-sm w-full">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-[#1A0A00] rounded-2xl flex items-center justify-center mx-auto mb-4">
            <ChefHat className="w-8 h-8 text-[#E8A020]" />
          </div>
          <h2 className="font-['Playfair_Display'] text-2xl font-bold text-[#1A0A00]">Admin Login</h2>
          <p className="text-[#1A0A00]/50 text-sm mt-1">The Khao Piyo Café</p>
        </div>
        <input
          type="password"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !loading && login()}
          placeholder="Enter admin password"
          disabled={loading}
          className={`w-full border-2 rounded-xl px-4 py-3 mb-4 outline-none transition-colors disabled:opacity-60 ${
            error
              ? "border-red-400"
              : "border-[#1A0A00]/20 focus:border-[#C84B11]"
          }`}
        />
        {error && (
          <p className="text-red-500 text-sm mb-3 text-center">Incorrect password. Try again.</p>
        )}
        <button
          onClick={login}
          disabled={loading}
          className="w-full bg-[#C84B11] text-white font-bold py-3 rounded-xl hover:bg-[#a83d0e] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? "Signing in…" : "Sign In"}
        </button>
      </div>
    </div>
  );
}
