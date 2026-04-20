"use client";
import { useState, useEffect } from "react";
import { Star, Send, CheckCircle } from "lucide-react";
import { useToast } from "@/components/Toast";

interface Review { id: string; name: string; rating: number; text: string; createdAt: string; }

export default function ReviewsPage() {
  const toast = useToast();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [name, setName] = useState("");
  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");
  const [hovered, setHovered] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/reviews").then((r) => r.json()).then(setReviews).catch(() => {});
  }, [submitted]);

  const submit = async () => {
    if (!name.trim() || !text.trim()) { toast("Please fill in all fields", "error"); return; }
    setLoading(true);
    try {
      await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, rating, text }),
      });
      setSubmitted(true);
      setName(""); setText(""); setRating(5);
      toast("Review submitted! Thank you 🌟", "success");
      setTimeout(() => setSubmitted(false), 4000);
    } catch { toast("Failed to submit", "error"); }
    finally { setLoading(false); }
  };

  const avg = reviews.length ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : "5.0";

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 font-['DM_Sans']">
      <div className="text-center mb-10">
        <p className="text-[#C84B11] font-semibold text-sm uppercase tracking-widest mb-2">What People Say</p>
        <h1 className="font-['Playfair_Display'] text-4xl font-bold text-[#1A0A00]">Customer Reviews</h1>
        <div className="flex items-center justify-center gap-3 mt-4">
          <div className="flex">{[...Array(5)].map((_, i) => <Star key={i} className="w-6 h-6 text-[#E8A020] fill-[#E8A020]" />)}</div>
          <span className="font-bold text-2xl text-[#1A0A00]">{avg}</span>
          <span className="text-[#1A0A00]/50">({reviews.length} reviews)</span>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Submit review */}
        <div className="bg-white rounded-3xl p-6 shadow-md">
          <h2 className="font-['Playfair_Display'] text-2xl font-bold text-[#1A0A00] mb-5">Write a Review</h2>

          {submitted ? (
            <div className="text-center py-8">
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
              <p className="text-[#1A0A00] font-semibold text-lg">Thank you for your review!</p>
              <p className="text-[#1A0A00]/50 text-sm mt-1">Your feedback means a lot to us 🙏</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Star selector */}
              <div>
                <label className="text-sm font-medium text-[#1A0A00]/70 mb-2 block">Your Rating</label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      onMouseEnter={() => setHovered(s)}
                      onMouseLeave={() => setHovered(0)}
                      onClick={() => setRating(s)}
                    >
                      <Star className={`w-8 h-8 transition-colors ${s <= (hovered || rating) ? "text-[#E8A020] fill-[#E8A020]" : "text-gray-300"}`} />
                    </button>
                  ))}
                </div>
              </div>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name *"
                className="w-full border border-[#1A0A00]/20 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#C84B11] transition-colors"
              />
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Share your experience... *"
                rows={4}
                className="w-full border border-[#1A0A00]/20 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#C84B11] transition-colors resize-none"
              />
              <button
                onClick={submit}
                disabled={loading}
                className="w-full bg-[#C84B11] hover:bg-[#a83d0e] text-white font-semibold py-3 rounded-xl transition-all hover:scale-105 flex items-center justify-center gap-2 disabled:opacity-60"
              >
                <Send className="w-4 h-4" /> {loading ? "Submitting..." : "Submit Review"}
              </button>
            </div>
          )}
        </div>

        {/* Review list */}
        <div className="space-y-4 max-h-[600px] overflow-y-auto pr-1">
          {reviews.map((r) => (
            <div key={r.id} className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#C84B11] to-[#E8A020] flex items-center justify-center text-white font-bold text-sm">
                    {r.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-[#1A0A00] text-sm">{r.name}</p>
                    <p className="text-[#1A0A00]/40 text-xs">{new Date(r.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</p>
                  </div>
                </div>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-4 h-4 ${i < r.rating ? "text-[#E8A020] fill-[#E8A020]" : "text-gray-200"}`} />
                  ))}
                </div>
              </div>
              <p className="text-[#1A0A00]/70 text-sm leading-relaxed">{r.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
