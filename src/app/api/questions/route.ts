import { NextRequest, NextResponse } from 'next/server';
import { readQuestions, writeQuestions } from '@/lib/questionStorage';
import { isAuthenticated } from '@/lib/auth';
import { ProductQuestion } from '@/types';

export async function GET(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const questions = await readQuestions();
  return NextResponse.json(questions);
}

export async function POST(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const body = await request.json();
    const productSlug = typeof body.productSlug === 'string' ? body.productSlug.trim() : '';
    const author = typeof body.author === 'string' ? body.author.trim() || 'Guest' : 'Guest';
    const bodyText = typeof body.body === 'string' ? body.body.trim() : '';
    if (!productSlug || !bodyText) {
      return NextResponse.json({ error: 'Product and question text required' }, { status: 400 });
    }
    const questions = await readQuestions();
    const newQ: ProductQuestion = {
      id: `q-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      productSlug,
      author,
      body: bodyText,
      createdAt: new Date().toISOString(),
    };
    questions.push(newQ);
    await writeQuestions(questions);
    return NextResponse.json(newQ);
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Failed to add question';
    console.error('Questions POST error:', e);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
