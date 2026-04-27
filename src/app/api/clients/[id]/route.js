import { NextResponse } from 'next/server';
import { updateClient, query } from '@/lib/cms';
import { getAdminFromCookies } from '@/lib/auth';

export async function GET(request, { params }) {
  const { id } = await params;
  const rows = await query('SELECT * FROM clients WHERE id = ?', [id]);
  if (rows.length === 0) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(rows[0]);
}

export async function PUT(request, { params }) {
  const { id } = await params;
  const admin = await getAdminFromCookies();
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  
  const data = await request.json();
  await updateClient(id, data);
  return NextResponse.json({ message: 'Client updated' });
}

export async function DELETE(request, { params }) {
  const { id } = await params;
  const admin = await getAdminFromCookies();
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  
  await query('DELETE FROM clients WHERE id = ?', [id]);
  return NextResponse.json({ message: 'Client deleted' });
}
