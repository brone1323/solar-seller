import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { isAuthenticated } from '@/lib/auth';

export async function POST(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file || !file.size) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const maxSize = 4 * 1024 * 1024; // 4MB
    if (file.size > maxSize) {
      return NextResponse.json({ error: 'File too large. Max 4MB.' }, { status: 400 });
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Invalid file type. Use JPEG, PNG, WebP, or GIF.' }, { status: 400 });
    }

    const blob = await put(`products/${Date.now()}-${file.name}`, file, {
      access: 'public',
    });

    return NextResponse.json({ url: blob.url });
  } catch (e) {
    console.error('Upload error:', e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Upload failed' },
      { status: 500 }
    );
  }
}
