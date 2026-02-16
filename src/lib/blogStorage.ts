import { list, put } from '@vercel/blob';
import { Redis } from '@upstash/redis';
import fs from 'fs';
import path from 'path';
import { blogArticles } from '@/data/blog';

export interface BlogArticle {
  id?: string;
  slug: string;
  title: string;
  sections: { heading: string; content: string[] }[];
  cta: string;
}

const REDIS_KEY = 'solar:blog';
const BLOB_PATH = 'blog/data.json';
const LOCAL_PATH = path.join(process.cwd(), 'src', 'data', 'blog-storage.json');

export function getStaticArticles(): BlogArticle[] {
  return blogArticles.map((a, i) => ({
    id: `b-${i}`,
    slug: a.slug,
    title: a.title,
    sections: a.sections,
    cta: a.cta,
  }));
}

export async function readBlogArticles(): Promise<BlogArticle[]> {
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
      console.error('Redis blog read error:', e);
    }
  }

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    try {
      const { blobs } = await list({ prefix: 'blog/' });
      const dataBlob = blobs.find((b) => b.pathname?.endsWith('data.json'));
      if (dataBlob?.url) {
        const res = await fetch(dataBlob.url, { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          return Array.isArray(data) ? data : [];
        }
      }
    } catch (e) {
      console.error('Blob blog read error:', e);
    }
  }

  if (!process.env.VERCEL) {
    try {
      const data = fs.readFileSync(LOCAL_PATH, 'utf-8');
      const parsed = JSON.parse(data);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      // no local file
    }
  }

  return [];
}

export async function writeBlogArticles(articles: BlogArticle[]): Promise<void> {
  const json = JSON.stringify(articles, null, 2);

  const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
  const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (redisUrl && redisToken) {
    try {
      const redis = new Redis({ url: redisUrl, token: redisToken });
      await redis.set(REDIS_KEY, json);
      return;
    } catch (e) {
      console.error('Redis blog write error:', e);
      throw new Error(`Redis save failed: ${e instanceof Error ? e.message : 'Unknown error'}`);
    }
  }

  const blobToken = process.env.BLOB_READ_WRITE_TOKEN;
  if (blobToken) {
    try {
      await put(BLOB_PATH, json, { access: 'public', addRandomSuffix: false, allowOverwrite: true });
      return;
    } catch (e) {
      console.error('Blob blog write error:', e);
      throw new Error(`Blob save failed: ${e instanceof Error ? e.message : 'Unknown error'}`);
    }
  }

  if (!process.env.VERCEL) {
    fs.mkdirSync(path.dirname(LOCAL_PATH), { recursive: true });
    fs.writeFileSync(LOCAL_PATH, json);
    return;
  }

  throw new Error('No storage configured for blog. Add Upstash Redis or Blob storage.');
}

export async function getBlogArticlesWithFallback(): Promise<BlogArticle[]> {
  const stored = await readBlogArticles();
  if (stored.length > 0) return stored;
  return getStaticArticles();
}

export async function seedBlogFromStaticIfEmpty(): Promise<BlogArticle[]> {
  let articles = await readBlogArticles();
  if (articles.length === 0) {
    articles = getStaticArticles();
    await writeBlogArticles(articles);
  }
  return articles;
}
