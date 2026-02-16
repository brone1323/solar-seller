import { list, put } from '@vercel/blob';
import fs from 'fs';
import path from 'path';
import { Product } from '@/types';

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
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return readLocalProducts();
  }

  try {
    const { blobs } = await list({ prefix: 'products/' });
    const dataBlob = blobs.find((b) => b.pathname === BLOB_PATH);
    if (!dataBlob?.url) return readLocalProducts();

    const res = await fetch(dataBlob.url);
    if (!res.ok) return readLocalProducts();
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch {
    return readLocalProducts();
  }
}

export async function writeProducts(products: Product[]): Promise<void> {
  const json = JSON.stringify(products, null, 2);

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    fs.writeFileSync(LOCAL_PATH, json);
    return;
  }

  await put(BLOB_PATH, json, {
    access: 'public',
    addRandomSuffix: false,
  });
}
