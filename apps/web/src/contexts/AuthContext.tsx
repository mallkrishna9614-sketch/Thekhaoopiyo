"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useToast } from "@/components/Toast";

interface User {
  email: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  sendOtp: (email: string) => Promise<boolean>;
  verifyOtp: (email: string, otp: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    // Check local storage for existing session
    const token = localStorage.getItem("kp_token");
    const storedEmail = localStorage.getItem("kp_email");
    if (token && storedEmail) {
      setUser({ email: storedEmail });
    }
    setLoading(false);
  }, []);

  const sendOtp = async (email: string) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
      const res = await fetch(`${apiUrl}/auth/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send OTP");
      
      toast("Verification email sent! 🍕", "success");
      return true;
    } catch (error: any) {
      toast(error.message || "Could not send OTP. Try again.", "error");
      return false;
    }
  };

  const verifyOtp = async (email: string, otp: string) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
      const res = await fetch(`${apiUrl}/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Invalid OTP");
      
      if (data.token) {
        localStorage.setItem("kp_token", data.token);
        localStorage.setItem("kp_email", email);
        setUser({ email });
        toast("Logged in successfully! Welcome back.", "success");
        return true;
      }
      return false;
    } catch (error: any) {
      toast(error.message || "Invalid OTP. Please try again.", "error");
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("kp_token");
    localStorage.removeItem("kp_email");
    setUser(null);
    toast("Logged out successfully.", "info");
  };

  return (
    <AuthContext.Provider value={{ user, loading, sendOtp, verifyOtp, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
