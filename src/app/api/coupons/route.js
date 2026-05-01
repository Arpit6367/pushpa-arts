import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getAdminFromCookies } from '@/lib/auth';

// GET - Fetch all coupons (admin only)
export async function GET(request) {
  try {
    const admin = await getAdminFromCookies();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const coupons = await query('SELECT * FROM coupons ORDER BY created_at DESC');
    return NextResponse.json({ coupons });
  } catch (error) {
    console.error('Error fetching coupons:', error);
    return NextResponse.json({ error: 'Failed to fetch coupons' }, { status: 500 });
  }
}

// POST - Create a new coupon (admin only)
export async function POST(request) {
  try {
    const admin = await getAdminFromCookies();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { code, description, discount_type, discount_value, min_order_amount, max_discount_amount, usage_limit, expires_at, is_active } = body;

    if (!code || !discount_value) {
      return NextResponse.json({ error: 'Code and discount value are required.' }, { status: 400 });
    }

    // Check for duplicate code
    const existing = await query('SELECT id FROM coupons WHERE code = ?', [code.toUpperCase().trim()]);
    if (existing.length > 0) {
      return NextResponse.json({ error: 'A coupon with this code already exists.' }, { status: 409 });
    }

    const result = await query(
      `INSERT INTO coupons (code, description, discount_type, discount_value, min_order_amount, max_discount_amount, usage_limit, expires_at, is_active)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        code.toUpperCase().trim(),
        description || null,
        discount_type || 'percentage',
        discount_value,
        min_order_amount || null,
        max_discount_amount || null,
        usage_limit || null,
        expires_at || null,
        is_active !== false ? 1 : 0
      ]
    );

    return NextResponse.json({ id: result.insertId, message: 'Coupon created successfully.' }, { status: 201 });
  } catch (error) {
    console.error('Error creating coupon:', error);
    return NextResponse.json({ error: 'Failed to create coupon' }, { status: 500 });
  }
}
