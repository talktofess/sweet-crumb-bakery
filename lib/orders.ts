// A minimal file-backed order store for the demo. In production this would be a
// database (Postgres/Prisma, etc.) — the interface is the same: record a paid
// order, look it up, list them. Writes are read-modify-write of a JSON file,
// which is fine for a demo, not for real concurrency.
import { promises as fs } from "fs";
import path from "path";

export interface OrderItem {
  name: string;
  quantity: number;
  amountTotal: number; // cents
}

export interface Order {
  id: string; // Stripe session id
  createdAt: string;
  email: string | null;
  name: string | null;
  amountTotal: number; // cents
  currency: string;
  fulfilment: string;
  paymentStatus: string;
  items: OrderItem[];
}

const DATA_DIR = path.join(process.cwd(), ".data");
const ORDERS_FILE = path.join(DATA_DIR, "orders.json");

async function readAll(): Promise<Order[]> {
  try {
    const raw = await fs.readFile(ORDERS_FILE, "utf-8");
    return JSON.parse(raw) as Order[];
  } catch {
    return [];
  }
}

async function writeAll(orders: Order[]): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(ORDERS_FILE, JSON.stringify(orders, null, 2), "utf-8");
}

/** Idempotent: recording the same session id twice keeps a single order. */
export async function recordOrder(order: Order): Promise<void> {
  const orders = await readAll();
  if (orders.some((o) => o.id === order.id)) return;
  orders.push(order);
  await writeAll(orders);
}

export async function getOrder(id: string): Promise<Order | undefined> {
  return (await readAll()).find((o) => o.id === id);
}

export async function listOrders(): Promise<Order[]> {
  return readAll();
}
