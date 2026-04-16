import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getAdminFromCookies } from '@/lib/auth';
import slugify from 'slugify';
import { getAllCategoriesWithPaths } from '@/lib/categories';

export async function GET(request) {
  try {
    const categoriesWithPath = await getAllCategoriesWithPaths();
    
    // Filtering logic if needed (e.g., parent_id, active_only)
    const { searchParams } = new URL(request.url);
    const parent_id = searchParams.get('parent_id');
    const active_only = searchParams.get('active_only');
    
    let filtered = categoriesWithPath;
    
    if (active_only === 'true') {
      filtered = filtered.filter(c => c.is_active);
    }
    
    if (parent_id) {
      filtered = filtered.filter(c => String(c.parent_id) === String(parent_id));
    }

    return NextResponse.json(filtered);


  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const admin = await getAdminFromCookies();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, description, image, parent_id, sort_order, is_active } = body;

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    const slug = slugify(name, { lower: true, strict: true });

    const result = await query(
      'INSERT INTO categories (name, slug, description, image, parent_id, sort_order, is_active) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [name, slug, description || null, image || null, parent_id || null, sort_order || 0, is_active !== false]
    );

    return NextResponse.json({ id: result.insertId, slug, message: 'Category created' }, { status: 201 });
  } catch (error) {
    console.error('Error creating category:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return NextResponse.json({ error: 'A category with this name already exists' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 });
  }
}
