import { NextResponse } from 'next/server';
import { getHeroSlides, createHeroSlide } from '@/lib/cms';
import { getAdminFromCookies } from '@/lib/auth';

export async function GET() {
  const slides = await getHeroSlides();
  return NextResponse.json(slides);
}

export async function POST(request) {
  const admin = await getAdminFromCookies();
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  
  const data = await request.json();
  const id = await createHeroSlide(data);
  return NextResponse.json({ id, message: 'Slide created' });
}
