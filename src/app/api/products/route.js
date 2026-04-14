import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getAdminFromCookies } from '@/lib/auth';
import slugify from 'slugify';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category_id = searchParams.get('category_id');
    const category_slug = searchParams.get('category_slug');
    const featured = searchParams.get('featured');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = (page - 1) * limit;

    let sql = `SELECT p.*, c.name as category_name, c.slug as category_slug,
      (SELECT file_path FROM product_images WHERE product_id = p.id AND is_primary = TRUE LIMIT 1) as primary_image,
      (SELECT file_path FROM product_images WHERE product_id = p.id ORDER BY is_primary DESC, sort_order ASC LIMIT 1) as first_image
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id`;

    let countSql = 'SELECT COUNT(*) as total FROM products p LEFT JOIN categories c ON p.category_id = c.id';

    const conditions = [];
    const params = [];

    if (category_id) {
      conditions.push('p.category_id = ?');
      params.push(category_id);
    }

    if (category_slug) {
      conditions.push('c.slug = ?');
      params.push(category_slug);
    }

    if (featured === 'true') {
      conditions.push('p.is_featured = TRUE');
    }

    if (search) {
      conditions.push('(p.name LIKE ? OR p.short_description LIKE ?)');
      params.push(`%${search}%`, `%${search}%`);
    }

    // For public API, only show active products
    const admin = await getAdminFromCookies();
    if (!admin) {
      conditions.push('p.is_active = TRUE');
    }

    if (conditions.length > 0) {
      const whereClause = ' WHERE ' + conditions.join(' AND ');
      sql += whereClause;
      countSql += whereClause;
    }

    sql += ' ORDER BY p.sort_order ASC, p.created_at DESC';
    sql += ` LIMIT ${limit} OFFSET ${offset}`;

    const products = await query(sql, params);
    const countResult = await query(countSql, params);
    const total = countResult[0]?.total || 0;

    return NextResponse.json({
      products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const admin = await getAdminFromCookies();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, short_description, description, sku, category_id, is_featured, is_active, sort_order, meta_title, meta_description, images } = body;

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    const slug = slugify(name, { lower: true, strict: true });

    const result = await query(
      `INSERT INTO products (name, slug, short_description, description, sku, category_id, is_featured, is_active, sort_order, meta_title, meta_description)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, slug, short_description || null, description || null, sku || null, category_id || null, is_featured || false, is_active !== false, sort_order || 0, meta_title || null, meta_description || null]
    );

    const productId = result.insertId;

    // Insert images if provided
    if (images && images.length > 0) {
      for (let i = 0; i < images.length; i++) {
        const img = images[i];
        await query(
          'INSERT INTO product_images (product_id, file_path, alt_text, sort_order, is_primary) VALUES (?, ?, ?, ?, ?)',
          [productId, img.file_path, img.alt_text || name, i, i === 0]
        );
      }
    }

    return NextResponse.json({ id: productId, slug, message: 'Product created' }, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return NextResponse.json({ error: 'A product with this name already exists' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}
