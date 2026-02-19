import { NextRequest, NextResponse } from 'next/server';
import { readQuestions, writeQuestions, getQuestionsForProduct } from '@/lib/questionStorage';
import { ProductQuestion } from '@/types';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const questions = await readQuestions();
  const forProduct = getQuestionsForProduct(questions, slug);
  return NextResponse.json(forProduct);
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  try {
    const body = await request.json();
    const author = typeof body.author === 'string' ? body.author.trim() || 'Guest' : 'Guest';
    const bodyText = typeof body.body === 'string' ? body.body.trim() : '';
    if (!bodyText) {
      return NextResponse.json({ error: 'Question is required' }, { status: 400 });
    }
    const questions = await readQuestions();
    const newQ: ProductQuestion = {
      id: `q-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      productSlug: slug,
      author,
      body: bodyText,
      createdAt: new Date().toISOString(),
    };
    questions.push(newQ);
    await writeQuestions(questions);
    return NextResponse.json(newQ);
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Failed to submit question';
    console.error('Questions POST error:', e);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
