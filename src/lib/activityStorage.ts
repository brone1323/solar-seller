import { Redis } from '@upstash/redis';
import { list, put } from '@vercel/blob';

const REDIS_KEY = 'solar:activity';
const BLOB_PATH = 'activity/events.json';

export type AddToCartEvent = {
  type: 'add_to_cart';
  at: string;
  productId: string;
  productName: string;
  quantity: number;
};

export type PurchaseEvent = {
  type: 'purchase';
  at: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  address?: string;
  city?: string;
  province?: string;
  postalCode?: string;
  items: { productId: string; name: string; quantity: number; priceCents: number }[];
  subtotalCents: number;
  shippingCents: number;
  gstCents: number;
  totalCents: number;
  paypalOrderId?: string;
};

export type AbandonedCartEvent = {
  type: 'abandoned_cart';
  at: string;
  items: { productId: string; name: string; quantity: number; priceCents: number }[];
  subtotalCents: number;
};

export type ContactEvent = {
  type: 'contact';
  at: string;
  name: string;
  email: string;
  message: string;
};

export type ActivityEvent = AddToCartEvent | PurchaseEvent | AbandonedCartEvent | ContactEvent;

async function readEvents(): Promise<ActivityEvent[]> {
  const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
  const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (redisUrl && redisToken) {
    try {
      const redis = new Redis({ url: redisUrl, token: redisToken });
      const data = await redis.get(REDIS_KEY);
      if (data == null) return [];
      const arr = typeof data === 'string' ? JSON.parse(data) : data;
      return Array.isArray(arr) ? arr : [];
    } catch (e) {
      console.error('Redis activity read error:', e);
      return [];
    }
  }

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    try {
      const { blobs } = await list({ prefix: 'activity/' });
      const blob = blobs.find((b) => b.pathname === BLOB_PATH || b.pathname?.endsWith('events.json'));
      if (blob?.url) {
        const res = await fetch(blob.url, { cache: 'no-store' });
        if (res.ok) {
          const arr = await res.json();
          return Array.isArray(arr) ? arr : [];
        }
      }
    } catch (e) {
      console.error('Blob activity read error:', e);
    }
  }

  return [];
}

async function writeEvents(events: ActivityEvent[]): Promise<void> {
  const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
  const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (redisUrl && redisToken) {
    try {
      const redis = new Redis({ url: redisUrl, token: redisToken });
      await redis.set(REDIS_KEY, JSON.stringify(events));
      return;
    } catch (e) {
      console.error('Redis activity write error:', e);
      throw new Error('Failed to save activity.');
    }
  }

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    try {
      await put(BLOB_PATH, JSON.stringify(events), { access: 'public', addRandomSuffix: false, allowOverwrite: true });
      return;
    } catch (e) {
      console.error('Blob activity write error:', e);
      throw new Error('Failed to save activity.');
    }
  }

  throw new Error('No storage configured for activity. Add Upstash Redis or Vercel Blob.');
}

export async function getActivity(limit = 500): Promise<ActivityEvent[]> {
  const events = await readEvents();
  events.sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime());
  return events.slice(0, limit);
}

export async function appendActivity(event: ActivityEvent): Promise<void> {
  const events = await readEvents();
  events.push(event);
  await writeEvents(events);
}

export async function deleteActivity(index: number): Promise<void> {
  const events = await readEvents();
  if (index < 0 || index >= events.length) throw new Error('Index out of range');
  // Sort matches getActivity sort order (descending by date), so map back to original index
  const sorted = [...events].sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime());
  const target = sorted[index];
  const originalIndex = events.indexOf(target);
  if (originalIndex === -1) throw new Error('Event not found');
  events.splice(originalIndex, 1);
  await writeEvents(events);
}
