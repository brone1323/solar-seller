import { NextResponse } from 'next/server';
import { getLogoutHeaders } from '@/lib/auth';

export async function POST() {
  const res = NextResponse.json({ success: true });
  Object.entries(getLogoutHeaders()).forEach(([key, value]) => {
    res.headers.append(key, value);
  });
  return res;
}
