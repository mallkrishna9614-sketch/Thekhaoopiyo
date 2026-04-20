import { kv } from '@vercel/kv';

async function readJson<T>(filename: string, defaultVal: T): Promise<T> {
  try {
    const data = await kv.get<T>(filename);
    return data ?? defaultVal;
  } catch (error) {
    console.warn(`Failed to read ${filename} from KV, using default`, error);
    return defaultVal;
  }
}

async function writeJson<T>(filename: string, data: T): Promise<void> {
  try {
    await kv.set(filename, data);
  } catch (error) {
    console.error(`Failed to write ${filename} to KV`, error);
  }
}

// ─── Orders ────────────────────────────────────────────────────────────────

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  qty: number;
  image: string;
}

export interface Order {
  id: string;
  items: OrderItem[];
  subtotal: number;
  gst: number;
  discount: number;
  total: number;
  promoCode: string;
  address: string;
  customerName: string;
  phone: string;
  status: "pending" | "approved" | "cancelled" | "delivered";
  createdAt: string;
  adminNote?: string;
}

export async function getOrders(): Promise<Order[]> {
  return readJson<Order[]>("orders.json", []);
}

export async function addOrder(order: Order): Promise<void> {
  const orders = await getOrders();
  orders.unshift(order);
  await writeJson("orders.json", orders);
}

export async function updateOrder(id: string, update: Partial<Order>): Promise<Order | null> {
  const orders = await getOrders();
  const idx = orders.findIndex((o) => o.id === id);
  if (idx === -1) return null;
  orders[idx] = { ...orders[idx], ...update };
  await writeJson("orders.json", orders);
  return orders[idx];
}

// ─── Reviews ───────────────────────────────────────────────────────────────

export interface Review {
  id: string;
  name: string;
  rating: number;
  text: string;
  createdAt: string;
}

export async function getReviews(): Promise<Review[]> {
  const seed: Review[] = [
    { id: "r1", name: "Harman Thind", rating: 5, text: "Amazing kuhlad pizza! The ambiance is so cozy and food is fresh & hot. Will definitely visit again 🔥", createdAt: "2024-03-15" },
    { id: "r2", name: "Love Keep", rating: 5, text: "Best café in Mehatpur! The mojito is absolutely refreshing and paneer tikka is to die for. Love the vibe!", createdAt: "2024-03-10" },
    { id: "r3", name: "Surinder Singh", rating: 5, text: "Excellent food and great service. Blue Lagoon mocktail is beautiful & tasty. Loved every bite of the nachos!", createdAt: "2024-02-28" },
    { id: "r4", name: "Priya K", rating: 5, text: "Family-friendly café with fresh, hygienic food. Kids loved the mac & cheese. Highly recommended! 😍", createdAt: "2024-02-20" },
  ];
  const stored = await readJson<Review[]>("reviews.json", []);
  return [...seed, ...stored];
}

export async function addReview(review: Review): Promise<void> {
  const stored = await readJson<Review[]>("reviews.json", []);
  stored.unshift(review);
  await writeJson("reviews.json", stored);
}

// ─── Chat ──────────────────────────────────────────────────────────────────

export interface ChatMessage {
  role: "user" | "waiter" | "admin";
  text: string;
  time: string;
}

export interface ChatSession {
  id: string;
  sessionId: string;
  customerName: string;
  messages: ChatMessage[];
  status: "open" | "closed";
  createdAt: string;
}

export async function getChatSessions(): Promise<ChatSession[]> {
  return readJson<ChatSession[]>("chats.json", []);
}

export async function saveChatSession(session: ChatSession): Promise<void> {
  const all = await getChatSessions();
  const idx = all.findIndex((s) => s.id === session.id);
  if (idx === -1) all.unshift(session);
  else all[idx] = session;
  await writeJson("chats.json", all);
}

// ─── Refunds ───────────────────────────────────────────────────────────────

export interface RefundRequest {
  id: string;
  orderId: string;
  reason: string;
  description: string;
  contact: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
}

export async function getRefunds(): Promise<RefundRequest[]> {
  return readJson<RefundRequest[]>("refunds.json", []);
}

export async function addRefund(refund: RefundRequest): Promise<void> {
  const all = await getRefunds();
  all.unshift(refund);
  await writeJson("refunds.json", all);
}

export async function updateRefund(id: string, update: Partial<RefundRequest>): Promise<void> {
  const all = await getRefunds();
  const idx = all.findIndex((r) => r.id === id);
  if (idx !== -1) {
    all[idx] = { ...all[idx], ...update };
    await writeJson("refunds.json", all);
  }
}
