"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChefHat, Mail, KeyRound, ArrowRight } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"email" | "otp">("email");
  const [loading, setLoading] = useState(false);
  const { sendOtp, verifyOtp } = useAuth();
  const router = useRouter();

  const handleSendOtp = async () => {
    if (!email.includes("@")) return;
    setLoading(true);
    const success = await sendOtp(email);
    if (success) {
      setStep("otp");
    }
    setLoading(false);
  };

  const handleVerifyOtp = async () => {
    if (otp.length < 6) return;
    setLoading(true);
    const success = await verifyOtp(email, otp);
    if (success) {
      // Record login on Admin DB
      const adminUrl = window.location.hostname === "localhost" 
        ? "http://localhost:3002" 
        : process.env.NEXT_PUBLIC_ADMIN_URL ?? "https://thekhaoopiyo-admin.vercel.app";
        
      fetch(`${adminUrl}/api/logins`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      }).catch(() => {});
      
      router.push("/");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-[85vh] bg-[#FFF8EE] flex items-center justify-center px-4 font-['DM_Sans']">
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[#1A0A00] rounded-2xl flex items-center justify-center mx-auto mb-4">
            <ChefHat className="w-8 h-8 text-[#E8A020]" />
          </div>
          <h1 className="font-['Playfair_Display'] text-3xl font-bold text-[#1A0A00] mb-2">Welcome Back</h1>
          <p className="text-[#1A0A00]/60 text-sm">
            {step === "email" ? "Enter your email to continue" : "Enter the 6-digit OTP sent to your inbox"}
          </p>
        </div>

        {step === "email" ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#1A0A00]/70 mb-1.5">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="w-5 h-5 text-[#1A0A00]/40" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendOtp()}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#C84B11] focus:ring-2 focus:ring-[#C84B11]/20 outline-none transition-all"
                />
              </div>
            </div>
            <button
              onClick={handleSendOtp}
              disabled={!email.includes("@") || loading}
              className="w-full bg-[#1A0A00] hover:bg-[#2d1200] disabled:opacity-50 text-[#E8A020] font-semibold py-3.5 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 group"
            >
              {loading ? "Sending..." : "Send OTP"}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#1A0A00]/70 mb-1.5 flex justify-between">
                <span>Enter OTP</span>
                <button onClick={() => setStep("email")} className="text-[#C84B11] hover:underline text-xs">Edit Email</button>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <KeyRound className="w-5 h-5 text-[#1A0A00]/40" />
                </div>
                <input
                  type="text"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  onKeyDown={(e) => e.key === "Enter" && handleVerifyOtp()}
                  placeholder="••••••"
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#C84B11] focus:ring-2 focus:ring-[#C84B11]/20 outline-none transition-all tracking-widest text-lg font-mono placeholder:tracking-normal placeholder:text-base"
                />
              </div>
            </div>
            <button
              onClick={handleVerifyOtp}
              disabled={otp.length !== 6 || loading}
              className="w-full bg-[#C84B11] hover:bg-[#a83d0e] disabled:opacity-50 text-white font-semibold py-3.5 rounded-xl transition-all shadow-lg shadow-[#C84B11]/30 flex items-center justify-center"
            >
              {loading ? "Verifying..." : "Verify & Login"}
            </button>
            <p className="text-center text-xs text-[#1A0A00]/50 mt-2">
              Didn't receive the email? Check your spam folder.
            </p>
          </div>
        )}

        <div className="mt-8 pt-6 border-t border-gray-100 text-center">
          <p className="text-xs text-[#1A0A00]/40">Secured by The Khao Piyo Café • Real Email Verification</p>
        </div>
      </div>
    </div>
  );
}
