import { Redis } from '@upstash/redis';
import { list, put } from '@vercel/blob';

const REDIS_KEY = 'solar:settings';
const BLOB_PATH = 'settings/config.json';

export interface AppSettings {
  shippingDisabled: boolean;
}

const defaults: AppSettings = {
  shippingDisabled: false,
};

export async function getSettings(): Promise<AppSettings> {
  // Env override (no storage needed)
  if (process.env.SHIPPING_DISABLED === 'true') {
    return { ...defaults, shippingDisabled: true };
  }

  const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
  const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (redisUrl && redisToken) {
    try {
      const redis = new Redis({ url: redisUrl, token: redisToken });
      const data = await redis.get(REDIS_KEY);
      if (data && typeof data === 'object' && 'shippingDisabled' in data) {
        return { ...defaults, shippingDisabled: Boolean((data as AppSettings).shippingDisabled) };
      }
      if (typeof data === 'string') {
        const parsed = JSON.parse(data) as AppSettings;
        return { ...defaults, shippingDisabled: Boolean(parsed?.shippingDisabled) };
      }
    } catch (e) {
      console.error('Redis settings read error:', e);
    }
  }

  // Fallback: Vercel Blob
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    try {
      const { blobs } = await list({ prefix: 'settings/' });
      const configBlob = blobs.find((b) => b.pathname === BLOB_PATH || b.pathname?.endsWith('config.json'));
      if (configBlob?.url) {
        const res = await fetch(configBlob.url, { cache: 'no-store' });
        if (res.ok) {
          const parsed = (await res.json()) as AppSettings;
          return { ...defaults, shippingDisabled: Boolean(parsed?.shippingDisabled) };
        }
      }
    } catch (e) {
      console.error('Blob settings read error:', e);
    }
  }

  return { ...defaults };
}

export async function setSettings(updates: Partial<AppSettings>): Promise<AppSettings> {
  const current = await getSettings();
  const next: AppSettings = { ...current, ...updates };

  const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
  const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (redisUrl && redisToken) {
    try {
      const redis = new Redis({ url: redisUrl, token: redisToken });
      await redis.set(REDIS_KEY, JSON.stringify(next));
      return next;
    } catch (e) {
      console.error('Redis settings write error:', e);
      throw new Error('Failed to save settings.');
    }
  }

  // Fallback: Vercel Blob
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    try {
      await put(BLOB_PATH, JSON.stringify(next), { access: 'public', addRandomSuffix: false, allowOverwrite: true });
      return next;
    } catch (e) {
      console.error('Blob settings write error:', e);
      throw new Error('Failed to save settings.');
    }
  }

  throw new Error('No storage configured. Add Upstash Redis or Vercel Blob in your project, or set SHIPPING_DISABLED=true in Vercel Environment Variables to disable shipping.');
}
