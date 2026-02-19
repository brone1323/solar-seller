import { NextRequest, NextResponse } from 'next/server';
import { readQuestions, writeQuestions } from '@/lib/questionStorage';
import { isAuthenticated } from '@/lib/auth';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { id } = await params;
  try {
    const body = await request.json();
    const answer = typeof body.answer === 'string' ? body.answer.trim() : '';
    const questions = await readQuestions();
    const idx = questions.findIndex((q) => q.id === id);
    if (idx === -1) return NextResponse.json({ error: 'Question not found' }, { status: 404 });
    questions[idx] = { ...questions[idx], answer: answer || undefined };
    await writeQuestions(questions);
    return NextResponse.json(questions[idx]);
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Failed to update answer';
    console.error('Question PATCH error:', e);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
