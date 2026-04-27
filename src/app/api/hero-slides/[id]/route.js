import { NextResponse } from 'next/server';
import { updateHeroSlide, query } from '@/lib/cms';
import { getAdminFromCookies } from '@/lib/auth';

export async function GET(request, { params }) {
  const { id } = await params;
  const rows = await query('SELECT * FROM hero_slides WHERE id = ?', [id]);
  if (rows.length === 0) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(rows[0]);
}

export async function PUT(request, { params }) {
  const { id } = await params;
  const admin = await getAdminFromCookies();
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  
  const data = await request.json();
  await updateHeroSlide(id, data);
  return NextResponse.json({ message: 'Slide updated' });
}

export async function DELETE(request, { params }) {
  const { id } = await params;
  const admin = await getAdminFromCookies();
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  
  await query('DELETE FROM hero_slides WHERE id = ?', [id]);
  return NextResponse.json({ message: 'Slide deleted' });
}
