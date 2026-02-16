import { NextRequest, NextResponse } from 'next/server';
import { writeBlogArticles, seedBlogFromStaticIfEmpty, getBlogArticlesWithFallback } from '@/lib/blogStorage';
import { isAuthenticated } from '@/lib/auth';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const articles = await getBlogArticlesWithFallback();
  const article = articles.find((a) => a.id === id || a.slug === id);
  if (!article) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(article);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { id } = await params;
  const body = await request.json();
  const articles = await seedBlogFromStaticIfEmpty();

  const idx = articles.findIndex((a) => a.id === id || a.slug === id);
  if (idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const updated = {
    ...articles[idx],
    ...body,
    id: articles[idx].id,
    sections: Array.isArray(body.sections) ? body.sections : articles[idx].sections,
  };
  articles[idx] = updated;
  try {
    await writeBlogArticles(articles);
    return NextResponse.json(updated);
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Update failed';
    console.error('Blog PUT error:', e);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { id } = await params;
  const articles = await seedBlogFromStaticIfEmpty();

  const filtered = articles.filter((a) => a.id !== id && a.slug !== id);
  if (filtered.length === articles.length) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  try {
    await writeBlogArticles(filtered);
    return NextResponse.json({ success: true });
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Delete failed';
    console.error('Blog DELETE error:', e);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
