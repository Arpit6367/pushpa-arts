import { NextResponse } from 'next/server';
import { getFaqs, createFaq } from '@/lib/cms';
import { getAdminFromCookies } from '@/lib/auth';

export async function GET(request) {
  const admin = await getAdminFromCookies();
  const faqs = await getFaqs(!!admin);
  return NextResponse.json(faqs);
}

export async function POST(request) {
  const admin = await getAdminFromCookies();
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  
  const data = await request.json();
  const id = await createFaq(data);
  return NextResponse.json({ id, message: 'FAQ created' }, { status: 201 });
}
