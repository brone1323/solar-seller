import { NextRequest, NextResponse } from 'next/server';
import { readProducts, writeProducts } from '@/lib/productStorage';
import { Product } from '@/types';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const products = await readProducts();
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
  const products = await readProducts();
  const idx = products.findIndex((p) => p.id === id || p.slug === id);
  if (idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const updated: Product = {
    ...products[idx],
    ...body,
    id: products[idx].id,
    updatedAt: new Date().toISOString(),
  };
  products[idx] = updated;
  await writeProducts(products);
  return NextResponse.json(updated);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const products = await readProducts();
  const filtered = products.filter((p) => p.id !== id && p.slug !== id);
  if (filtered.length === products.length) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  await writeProducts(filtered);
  return NextResponse.json({ success: true });
}
