import { Redis } from '@upstash/redis';

const REDIS_KEY = 'solar:settings';

export interface AppSettings {
  shippingDisabled: boolean;
}

const defaults: AppSettings = {
  shippingDisabled: false,
};

export async function getSettings(): Promise<AppSettings> {
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
  throw new Error('No storage configured. Add Upstash Redis.');
}
