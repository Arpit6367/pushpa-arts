import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getAdminFromCookies } from '@/lib/auth';
import slugify from 'slugify';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const parent_id = searchParams.get('parent_id');
    const active_only = searchParams.get('active_only');

    let sql = 'SELECT c.*, p.name as parent_name FROM categories c LEFT JOIN categories p ON c.parent_id = p.id';
    const params = [];
    const conditions = [];

    if (parent_id) {
      conditions.push('c.parent_id = ?');
      params.push(parent_id);
    }

    if (active_only === 'true') {
      conditions.push('c.is_active = TRUE');
    }

    if (conditions.length > 0) {
      sql += ' WHERE ' + conditions.join(' AND ');
    }

    sql += ' ORDER BY c.sort_order ASC, c.name ASC';

    const categories = await query(sql, params);
    return NextResponse.json(categories);
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
