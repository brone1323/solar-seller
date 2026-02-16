import { NextRequest, NextResponse } from 'next/server';
import { writeBlogArticles, getBlogArticlesWithFallback, seedBlogFromStaticIfEmpty } from '@/lib/blogStorage';
import type { BlogArticle } from '@/lib/blogStorage';

export async function GET() {
  const articles = await getBlogArticlesWithFallback();
  return NextResponse.json(articles);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const articles = await seedBlogFromStaticIfEmpty();

    const slug = body.slug || (body.title || '').toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') || `post-${Date.now()}`;
    const newArticle: BlogArticle = {
      id: body.id || `b-${Date.now()}`,
      slug,
      title: body.title || 'Untitled',
      sections: Array.isArray(body.sections)
        ? body.sections
        : [{ heading: '', content: [''] }],
      cta: body.cta || '',
    };
    if (articles.some((a) => a.slug === newArticle.slug)) {
      newArticle.slug = `${newArticle.slug}-${Date.now()}`;
    }

    articles.push(newArticle);
    await writeBlogArticles(articles);
    return NextResponse.json(newArticle);
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Save failed';
    console.error('Blog POST error:', e);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
