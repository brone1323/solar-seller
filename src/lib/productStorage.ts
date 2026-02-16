import { list, put } from '@vercel/blob';
import { Redis } from '@upstash/redis';
import fs from 'fs';
import path from 'path';
import { Product } from '@/types';

const REDIS_KEY = 'solar:products';
const BLOB_PATH = 'products/data.json';
const LOCAL_PATH = path.join(process.cwd(), 'src', 'data', 'products.json');

function readLocalProducts(): Product[] {
  try {
    const data = fs.readFileSync(LOCAL_PATH, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export async function readProducts(): Promise<Product[]> {
  // 1. Try Upstash Redis (most reliable for product data)
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
      return readLocalProducts();
    } catch (e) {
      console.error('Redis read error:', e);
    }
  }

  // 2. Try Vercel Blob
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    try {
      const { blobs } = await list({ prefix: 'products/' });
      const dataBlob = blobs.find((b) => b.pathname === BLOB_PATH);
      if (dataBlob?.url) {
        const res = await fetch(dataBlob.url);
        if (res.ok) {
          const data = await res.json();
          return Array.isArray(data) ? data : [];
        }
      }
    } catch (e) {
      console.error('Blob read error:', e);
    }
  }

  return readLocalProducts();
}

export async function writeProducts(products: Product[]): Promise<void> {
  const json = JSON.stringify(products, null, 2);

  // 1. Try Upstash Redis
  const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
  const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (redisUrl && redisToken) {
    try {
      const redis = new Redis({ url: redisUrl, token: redisToken });
      await redis.set(REDIS_KEY, json);
      return;
    } catch (e) {
      console.error('Redis write error:', e);
      throw new Error(`Redis save failed: ${e instanceof Error ? e.message : 'Unknown error'}`);
    }
  }

  // 2. Try Vercel Blob
  const blobToken = process.env.BLOB_READ_WRITE_TOKEN;
  if (blobToken) {
    try {
      await put(BLOB_PATH, json, { access: 'public', addRandomSuffix: false, allowOverwrite: true });
      return;
    } catch (e) {
      console.error('Blob write error:', e);
      throw new Error(`Blob save failed: ${e instanceof Error ? e.message : 'Unknown error'}`);
    }
  }

  // 3. Local (dev only)
  if (!process.env.VERCEL) {
    fs.writeFileSync(LOCAL_PATH, json);
    return;
  }

  throw new Error(
    'No storage configured. Add Upstash Redis (Vercel Marketplace → Upstash) or connect Blob storage to this project, then redeploy.'
  );
}
