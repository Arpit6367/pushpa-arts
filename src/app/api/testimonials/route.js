import { NextResponse } from 'next/server';
import { getTestimonials, createTestimonial } from '@/lib/cms';
import { getAdminFromCookies } from '@/lib/auth';

export async function GET() {
  const testimonials = await getTestimonials();
  return NextResponse.json(testimonials);
}

export async function POST(request) {
  const admin = await getAdminFromCookies();
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  
  const data = await request.json();
  const id = await createTestimonial(data);
  return NextResponse.json({ id, message: 'Testimonial created' });
}
