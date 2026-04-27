import { NextResponse } from 'next/server';
import { getClients, createClient } from '@/lib/cms';
import { getAdminFromCookies } from '@/lib/auth';

export async function GET(request) {
  const admin = await getAdminFromCookies();
  const clients = await getClients(!!admin);
  return NextResponse.json(clients);
}

export async function POST(request) {
  const admin = await getAdminFromCookies();
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  
  const data = await request.json();
  const id = await createClient(data);
  return NextResponse.json({ id, message: 'Client created' }, { status: 201 });
}
