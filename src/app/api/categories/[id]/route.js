import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getAdminFromCookies } from '@/lib/auth';
import slugify from 'slugify';

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const categories = await query(
      'SELECT c.*, p.name as parent_name FROM categories c LEFT JOIN categories p ON c.parent_id = p.id WHERE c.id = ?',
      [id]
    );

    if (categories.length === 0) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    // Also get subcategories
    const subcategories = await query(
      'SELECT * FROM categories WHERE parent_id = ? ORDER BY sort_order ASC',
      [id]
    );

    // Get product count
    const countResult = await query(
      'SELECT COUNT(*) as count FROM products WHERE category_id = ? AND is_active = TRUE',
      [id]
    );

    return NextResponse.json({
      ...categories[0],
      subcategories,
      product_count: countResult[0].count,
    });
  } catch (error) {
    console.error('Error fetching category:', error);
    return NextResponse.json({ error: 'Failed to fetch category' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const admin = await getAdminFromCookies();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { name, description, image, parent_id, sort_order, is_active } = body;

    const slug = name ? slugify(name, { lower: true, strict: true }) : undefined;

    const fields = [];
    const values = [];

    if (name !== undefined) { fields.push('name = ?'); values.push(name); }
    if (slug !== undefined) { fields.push('slug = ?'); values.push(slug); }
    if (description !== undefined) { fields.push('description = ?'); values.push(description); }
    if (image !== undefined) { fields.push('image = ?'); values.push(image); }
    if (parent_id !== undefined) { fields.push('parent_id = ?'); values.push(parent_id || null); }
    if (sort_order !== undefined) { fields.push('sort_order = ?'); values.push(sort_order); }
    if (is_active !== undefined) { fields.push('is_active = ?'); values.push(is_active); }

    if (fields.length === 0) {
      return NextResponse.json({ error: 'No fields to update' }, { status: 400 });
    }

    values.push(id);
    await query(`UPDATE categories SET ${fields.join(', ')} WHERE id = ?`, values);

    return NextResponse.json({ message: 'Category updated' });
  } catch (error) {
    console.error('Error updating category:', error);
    return NextResponse.json({ error: 'Failed to update category' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const admin = await getAdminFromCookies();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    await query('DELETE FROM categories WHERE id = ?', [id]);
    return NextResponse.json({ message: 'Category deleted' });
  } catch (error) {
    console.error('Error deleting category:', error);
    return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 });
  }
}
