import { Redis } from '@upstash/redis';

const REDIS_KEY = 'solar:pageviews';
const MAX_EVENTS = 2000;

export interface PageView {
  sessionId: string;
  visitorId: string;
  path: string;
  title: string;
  at: string;
  referrer?: string;
}

async function getRedis(): Promise<Redis | null> {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  return new Redis({ url, token });
}

export async function recordPageView(view: PageView): Promise<void> {
  const redis = await getRedis();
  if (!redis) return;
  try {
    const raw = await redis.get(REDIS_KEY);
    const list: PageView[] = Array.isArray(raw) ? raw : (typeof raw === 'string' ? JSON.parse(raw) : []);
    list.push(view);
    // Keep only the most recent events to avoid unbounded growth
    const trimmed = list.length > MAX_EVENTS ? list.slice(list.length - MAX_EVENTS) : list;
    await redis.set(REDIS_KEY, JSON.stringify(trimmed));
  } catch (e) {
    console.error('pageView record error:', e);
  }
}

export async function getPageViews(limit = 1000): Promise<PageView[]> {
  const redis = await getRedis();
  if (!redis) return [];
  try {
    const raw = await redis.get(REDIS_KEY);
    const list: PageView[] = Array.isArray(raw) ? raw : (typeof raw === 'string' ? JSON.parse(raw) : []);
    list.sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime());
    return list.slice(0, limit);
  } catch (e) {
    console.error('pageView read error:', e);
    return [];
  }
}

export async function clearPageViews(): Promise<void> {
  const redis = await getRedis();
  if (!redis) return;
  await redis.del(REDIS_KEY);
}
