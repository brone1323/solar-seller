import { NextResponse } from 'next/server';
import { isAuthenticated } from '@/lib/auth';
import { getActivity } from '@/lib/activityStorage';

/** Admin: list cart adds and purchases (auth required) */
export async function GET(request: Request) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const { searchParams } = new URL(request.url);
    const limit = Math.min(parseInt(searchParams.get('limit') || '500', 10), 1000);
    const events = await getActivity(limit);
    return NextResponse.json(events);
  } catch (e) {
    console.error('Admin activity GET error:', e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Failed to load activity' },
      { status: 500 }
    );
  }
}
