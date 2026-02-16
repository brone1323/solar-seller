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
  try {
    await writeProducts(products);
    return NextResponse.json(updated);
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Save failed';
    console.error('Products update error:', e);
    return NextResponse.json({ error: message }, { status: 500 });
  }
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
  try {
    await writeProducts(filtered);
    return NextResponse.json({ success: true });
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Delete failed';
    console.error('Products delete error:', e);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
