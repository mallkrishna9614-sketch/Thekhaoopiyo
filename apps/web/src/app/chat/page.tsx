"use client";
import { useState, useEffect, useRef } from "react";
import { Send, MessageCircle } from "lucide-react";

interface Message { role: "user" | "waiter"; text: string; time: string; }

const AUTO_RESPONSES: Record<string, string> = {
  reservation: "Sure! We'd love to have you. 🪑 Please call us at 077430 23125 to book a table. We're open daily 9 AM – 9:30 PM.",
  table: "Sure! We'd love to have you. 🪑 Please call us at 077430 23125 to book a table. We're open daily 9 AM – 9:30 PM.",
  special: "Today's specials: 🍕 Kuhlad Pizza (₹199), 🥤 Blue Lagoon Mocktail (₹119), and our famous 🧀 Mac & Cheese (₹199)! Don't miss out!",
  today: "Today's specials: 🍕 Kuhlad Pizza (₹199), 🥤 Blue Lagoon Mocktail (₹119), and our famous 🧀 Mac & Cheese (₹199)! Don't miss out!",
  veg: "We have plenty of veg options! 🥗 Kuhlad Pizza, Loaded Nachos, Paneer Tikka, Veg Wrap, Mac & Cheese, Mojito, Cold Coffee, Blue Lagoon — all vegetarian!",
  vegetarian: "We have plenty of veg options! 🥗 Kuhlad Pizza, Loaded Nachos, Paneer Tikka, Veg Wrap, Mac & Cheese, Mojito, Cold Coffee, Blue Lagoon — all vegetarian!",
  delivery: "We deliver home! 🚴 Estimated time: 30–45 minutes. We accept Cash and UPI. Delivery is FREE on all orders!",
  deliver: "We deliver home! 🚴 Estimated time: 30–45 minutes. We accept Cash and UPI. Delivery is FREE on all orders!",
  time: "We're open daily from 9:00 AM to 9:30 PM. 🕘 Kitchen closes at 9 PM. Come visit us at Parjian Road, Mehatpur!",
  hour: "We're open daily from 9:00 AM to 9:30 PM. 🕘 Kitchen closes at 9 PM. Come visit us at Parjian Road, Mehatpur!",
  price: "Our prices range from ₹99 to ₹249. Most items are between ₹150–₹200. Great value for fresh, quality food! 💰",
  cost: "Our prices range from ₹99 to ₹249. Most items are between ₹150–₹200. Great value for fresh, quality food! 💰",
  pizza: "Our pizzas are amazing! 🍕 Try the signature Kuhlad Pizza (₹199, veg) or the smoky BBQ Chicken Pizza (₹249). Both are bestsellers!",
  burger: "Our Chicken Burger (₹179) is a crowd favourite — juicy patty, fresh veggies, special sauce. You'll love it! 🍔",
  mojito: "The Mojito (₹99) is our #1 drink! Fresh mint, lime, crushed ice. Absolutely refreshing after a meal! 🌿",
};

const QUICK_REPLIES = [
  "I want to reserve a table",
  "What are today's specials?",
  "Do you have veg options?",
  "Do you do home delivery?",
  "What are your timings?",
];

function getAutoResponse(msg: string): string {
  const lower = msg.toLowerCase();
  for (const [keyword, response] of Object.entries(AUTO_RESPONSES)) {
    if (lower.includes(keyword)) return response;
  }
  return "Thanks for reaching out! 😊 Our team will respond shortly. For urgent queries, call us at 077430 23125. We're here to help!";
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "waiter", text: "Namaste! 🙏 Welcome to The Khao Piyo Café. I'm your virtual waiter. How can I help you today?", time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) },
  ]);
  const [input, setInput] = useState("");
  const [sessionId] = useState(() => `sess_${Date.now()}`);
  const [name, setName] = useState("");
  const [nameSet, setNameSet] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const [typing, setTyping] = useState(false);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, typing]);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;
    const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const userMsg: Message = { role: "user", text, time };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setTyping(true);

    // Save to backend
    const updatedMessages = [...messages, userMsg];
    await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId, customerName: name || "Guest", messages: updatedMessages }),
    }).catch(() => {});

    setTimeout(() => {
      const autoReply = getAutoResponse(text);
      const waiterMsg: Message = { role: "waiter", text: autoReply, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) };
      setMessages((prev) => [...prev, waiterMsg]);
      setTyping(false);
    }, 1000 + Math.random() * 800);
  };

  if (!nameSet) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFF8EE] px-4">
        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-sm w-full text-center">
          <MessageCircle className="w-12 h-12 text-[#C84B11] mx-auto mb-4" />
          <h2 className="font-['Playfair_Display'] text-2xl font-bold text-[#1A0A00] mb-2">Chat With Us</h2>
          <p className="text-[#1A0A00]/60 text-sm mb-6">Enter your name to start chatting with our team</p>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && name.trim() && setNameSet(true)}
            placeholder="Your name..."
            className="w-full border border-[#1A0A00]/20 rounded-xl px-4 py-2.5 mb-4 outline-none focus:border-[#C84B11] transition-colors"
          />
          <button
            onClick={() => name.trim() && setNameSet(true)}
            className="w-full bg-[#C84B11] text-white font-semibold py-3 rounded-xl hover:bg-[#a83d0e] transition-all"
          >
            Start Chat
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 font-['DM_Sans']">
      {/* Header */}
      <div className="bg-[#1A0A00] rounded-t-3xl p-5 flex items-center gap-4">
        <div className="relative">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#C84B11] to-[#E8A020] flex items-center justify-center text-2xl">🧑‍🍳</div>
          <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-400 rounded-full border-2 border-[#1A0A00]" />
        </div>
        <div>
          <p className="text-[#FFF8EE] font-semibold">Khao Piyo Waiter</p>
          <p className="text-green-400 text-xs flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse inline-block" /> Online now</p>
        </div>
      </div>

      {/* Messages */}
      <div className="bg-white border-x border-[#1A0A00]/10 h-96 overflow-y-auto p-4 space-y-3">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${ m.role === "user" ? "bg-[#C84B11] text-white rounded-br-sm" : "bg-[#FFF8EE] text-[#1A0A00] rounded-bl-sm border border-[#1A0A00]/10" }`}>
              <p className="text-sm leading-relaxed">{m.text}</p>
              <p className={`text-xs mt-1 ${m.role === "user" ? "text-white/60" : "text-[#1A0A00]/40"}`}>{m.time}</p>
            </div>
          </div>
        ))}
        {typing && (
          <div className="flex justify-start">
            <div className="bg-[#FFF8EE] border border-[#1A0A00]/10 rounded-2xl rounded-bl-sm px-4 py-3">
              <div className="flex gap-1 items-center h-4">
                <span className="w-2 h-2 bg-[#C84B11] rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-2 h-2 bg-[#C84B11] rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-2 h-2 bg-[#C84B11] rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Quick replies */}
      <div className="bg-white border-x border-[#1A0A00]/10 px-4 py-2 flex gap-2 overflow-x-auto">
        {QUICK_REPLIES.map((q) => (
          <button key={q} onClick={() => sendMessage(q)} className="flex-shrink-0 bg-[#FFF8EE] border border-[#C84B11]/30 text-[#C84B11] text-xs px-3 py-1.5 rounded-full hover:bg-[#C84B11] hover:text-white transition-all">
            {q}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="bg-white border border-[#1A0A00]/10 rounded-b-3xl p-4 flex gap-3">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
          placeholder="Type a message..."
          className="flex-1 border border-[#1A0A00]/20 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#C84B11] transition-colors"
        />
        <button
          onClick={() => sendMessage(input)}
          disabled={!input.trim()}
          className="bg-[#C84B11] text-white p-2.5 rounded-xl hover:bg-[#a83d0e] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
