import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getAdminFromCookies } from '@/lib/auth';
import slugify from 'slugify';

export async function GET(request, { params }) {
  try {
    const { id } = await params;

    // Check if id is a slug or number
    const isNumeric = /^\d+$/.test(id);
    const sql = isNumeric
      ? 'SELECT p.*, c.name as category_name, c.slug as category_slug FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE p.id = ?'
      : 'SELECT p.*, c.name as category_name, c.slug as category_slug FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE p.slug = ?';

    const products = await query(sql, [id]);

    if (products.length === 0) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const product = products[0];

    // Get images
    const images = await query(
      'SELECT * FROM product_images WHERE product_id = ? ORDER BY is_primary DESC, sort_order ASC',
      [product.id]
    );

    // Get related products from same category
    const related = await query(
      `SELECT p.*, 
        (SELECT file_path FROM product_images WHERE product_id = p.id ORDER BY is_primary DESC, sort_order ASC LIMIT 1) as first_image
       FROM products p WHERE p.category_id = ? AND p.id != ? AND p.is_active = TRUE ORDER BY RAND() LIMIT 4`,
      [product.category_id, product.id]
    );

    return NextResponse.json({
      ...product,
      images,
      related_products: related,
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
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
    const { name, short_description, description, sku, category_id, is_featured, is_active, sort_order, meta_title, meta_description, images } = body;

    const fields = [];
    const values = [];

    if (name !== undefined) {
      fields.push('name = ?');
      values.push(name);
      fields.push('slug = ?');
      values.push(slugify(name, { lower: true, strict: true }));
    }
    if (short_description !== undefined) { fields.push('short_description = ?'); values.push(short_description); }
    if (description !== undefined) { fields.push('description = ?'); values.push(description); }
    if (sku !== undefined) { fields.push('sku = ?'); values.push(sku); }
    if (category_id !== undefined) { fields.push('category_id = ?'); values.push(category_id || null); }
    if (is_featured !== undefined) { fields.push('is_featured = ?'); values.push(is_featured); }
    if (is_active !== undefined) { fields.push('is_active = ?'); values.push(is_active); }
    if (sort_order !== undefined) { fields.push('sort_order = ?'); values.push(sort_order); }
    if (meta_title !== undefined) { fields.push('meta_title = ?'); values.push(meta_title); }
    if (meta_description !== undefined) { fields.push('meta_description = ?'); values.push(meta_description); }

    if (fields.length > 0) {
      values.push(id);
      await query(`UPDATE products SET ${fields.join(', ')} WHERE id = ?`, values);
    }

    // Update images if provided
    if (images !== undefined) {
      // Delete existing images
      await query('DELETE FROM product_images WHERE product_id = ?', [id]);

      // Insert new images
      for (let i = 0; i < images.length; i++) {
        const img = images[i];
        await query(
          'INSERT INTO product_images (product_id, file_path, alt_text, sort_order, is_primary) VALUES (?, ?, ?, ?, ?)',
          [id, img.file_path, img.alt_text || '', i, i === 0]
        );
      }
    }

    return NextResponse.json({ message: 'Product updated' });
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const admin = await getAdminFromCookies();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    await query('DELETE FROM products WHERE id = ?', [id]);
    return NextResponse.json({ message: 'Product deleted' });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}
