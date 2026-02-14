import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { Product } from '@/types';

const DATA_PATH = path.join(process.cwd(), 'src', 'data', 'products.json');

function readProducts(): Product[] {
  try {
    const data = fs.readFileSync(DATA_PATH, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

function writeProducts(products: Product[]) {
  fs.writeFileSync(DATA_PATH, JSON.stringify(products, null, 2));
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const products = readProducts();
  const product = products.find((p) => p.id === id || p.slug === id);
  if (!product) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(product);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const products = readProducts();
  const idx = products.findIndex((p) => p.id === id || p.slug === id);
  if (idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const updated: Product = {
    ...products[idx],
    ...body,
    id: products[idx].id,
    updatedAt: new Date().toISOString(),
  };
  products[idx] = updated;
  writeProducts(products);
  return NextResponse.json(updated);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const products = readProducts();
  const filtered = products.filter((p) => p.id !== id && p.slug !== id);
  if (filtered.length === products.length) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  writeProducts(filtered);
  return NextResponse.json({ success: true });
}
