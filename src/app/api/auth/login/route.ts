import { NextRequest, NextResponse } from 'next/server';
import { checkCredentials, getAuthHeaders } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();
    if (!checkCredentials(username || '', password || '')) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }
    const res = NextResponse.json({ success: true });
    Object.entries(getAuthHeaders()).forEach(([key, value]) => {
      res.headers.append(key, value);
    });
    return res;
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
