import { NextRequest, NextResponse } from 'next/server';
import { readProducts, writeProducts } from '@/lib/productStorage';
import { Product } from '@/types';

export async function GET() {
  const products = await readProducts();
  return NextResponse.json(products);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const products = await readProducts();

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
    await writeProducts(products);
    return NextResponse.json(newProduct);
  } catch (e) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
