import { NextResponse } from 'next/server';
import { updatePage, getPageBySlug, deletePage, query } from '@/lib/cms';
import { getAdminFromCookies } from '@/lib/auth';

export async function GET(request, { params }) {
  const { slug } = await params;
  const page = await getPageBySlug(slug);
  if (!page) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(page);
}

export async function PUT(request, { params }) {
  const { slug } = await params;
  const admin = await getAdminFromCookies();
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  
  const data = await request.json();
  const page = await getPageBySlug(slug);
  if (!page) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  
  await updatePage(page.id, data);
  return NextResponse.json({ message: 'Page updated' });
}

export async function DELETE(request, { params }) {
  const { slug } = await params;
  const admin = await getAdminFromCookies();
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  
  const page = await getPageBySlug(slug);
  if (!page) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  
  // Protect core pages if necessary, but here we allow deletion
  await deletePage(page.id);
  return NextResponse.json({ message: 'Page deleted' });
}
