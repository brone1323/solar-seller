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

export async function GET() {
  const products = readProducts();
  return NextResponse.json(products);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const products = readProducts();

    const newProduct: Product = {
      id: body.id || `p-${Date.now()}`,
      name: body.name || 'Untitled',
      slug: body.slug || body.name?.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') || `product-${Date.now()}`,
      description: body.description || '',
      longDescription: body.longDescription,
      price: Number(body.price) || 0,
      images: Array.isArray(body.images) ? body.images : body.images ? [body.images] : [],
      category: body.category || 'Uncategorized',
      specifications: typeof body.specifications === 'object' ? body.specifications : {},
      featured: Boolean(body.featured),
      createdAt: body.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (products.some((p) => p.slug === newProduct.slug)) {
      newProduct.slug = `${newProduct.slug}-${Date.now()}`;
    }

    products.push(newProduct);
    writeProducts(products);
    return NextResponse.json(newProduct);
  } catch (e) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
