import { NextResponse } from 'next/server';
import { getPages, createPage } from '@/lib/cms';
import { getAdminFromCookies } from '@/lib/auth';

export async function GET(request) {
  const admin = await getAdminFromCookies();
  const pages = await getPages(!!admin);
  return NextResponse.json(pages);
}

export async function POST(request) {
  const admin = await getAdminFromCookies();
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  
  const data = await request.json();
  if (!data.title) return NextResponse.json({ error: 'Title is required' }, { status: 400 });
  
  try {
    const id = await createPage(data);
    return NextResponse.json({ id, message: 'Page created' });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return NextResponse.json({ error: 'A page with this title/slug already exists' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to create page' }, { status: 500 });
  }
}
