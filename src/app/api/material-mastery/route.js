import { NextResponse } from 'next/server';
import { getMaterialMastery, createMaterialMastery } from '@/lib/cms';
import { getAdminFromCookies } from '@/lib/auth';

export async function GET() {
  const items = await getMaterialMastery();
  return NextResponse.json(items);
}

export async function POST(request) {
  const admin = await getAdminFromCookies();
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  
  const data = await request.json();
  const id = await createMaterialMastery(data);
  return NextResponse.json({ id, message: 'Material mastery item created' });
}
