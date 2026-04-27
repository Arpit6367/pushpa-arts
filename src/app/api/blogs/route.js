import { NextResponse } from 'next/server';
import { getBlogs, createBlog } from '@/lib/cms';
import { getAdminFromCookies } from '@/lib/auth';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get('limit') || '10');
  const offset = parseInt(searchParams.get('offset') || '0');
  const admin = await getAdminFromCookies();
  
  const blogs = await getBlogs(limit, offset, !!admin);
  return NextResponse.json(blogs);
}

export async function POST(request) {
  const admin = await getAdminFromCookies();
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  
  const data = await request.json();
  const id = await createBlog(data);
  return NextResponse.json({ id, message: 'Blog created' }, { status: 201 });
}
