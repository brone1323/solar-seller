import { Redis } from '@upstash/redis';
import { ProductQuestion } from '@/types';

const REDIS_KEY = 'solar:questions';

export async function readQuestions(): Promise<ProductQuestion[]> {
  const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
  const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (redisUrl && redisToken) {
    try {
      const redis = new Redis({ url: redisUrl, token: redisToken });
      const data = await redis.get(REDIS_KEY);
      if (data) {
        const parsed = typeof data === 'string' ? JSON.parse(data) : data;
        return Array.isArray(parsed) ? parsed : [];
      }
    } catch (e) {
      console.error('Redis questions read error:', e);
    }
  }
  return [];
}

export async function writeQuestions(questions: ProductQuestion[]): Promise<void> {
  const json = JSON.stringify(questions, null, 2);
  const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
  const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (redisUrl && redisToken) {
    try {
      const redis = new Redis({ url: redisUrl, token: redisToken });
      await redis.set(REDIS_KEY, json);
      return;
    } catch (e) {
      console.error('Redis questions write error:', e);
      throw new Error(`Redis save failed: ${e instanceof Error ? e.message : 'Unknown error'}`);
    }
  }
  throw new Error('No storage configured for questions. Add Upstash Redis.');
}

export function getQuestionsForProduct(questions: ProductQuestion[], productSlug: string): ProductQuestion[] {
  const now = new Date().toISOString();
  return questions
    .filter((q) => q.productSlug === productSlug && (!q.scheduledFor || q.scheduledFor <= now))
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
}
