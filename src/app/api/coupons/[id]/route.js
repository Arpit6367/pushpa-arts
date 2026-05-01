import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getAdminFromCookies } from '@/lib/auth';

// PATCH - Update a coupon (admin only)
export async function PATCH(request, { params }) {
  try {
    const admin = await getAdminFromCookies();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { code, description, discount_type, discount_value, min_order_amount, max_discount_amount, usage_limit, expires_at, is_active } = body;

    // Check for duplicate code (excluding current)
    if (code) {
      const existing = await query('SELECT id FROM coupons WHERE code = ? AND id != ?', [code.toUpperCase().trim(), id]);
      if (existing.length > 0) {
        return NextResponse.json({ error: 'A coupon with this code already exists.' }, { status: 409 });
      }
    }

    await query(
      `UPDATE coupons SET code = ?, description = ?, discount_type = ?, discount_value = ?, min_order_amount = ?, max_discount_amount = ?, usage_limit = ?, expires_at = ?, is_active = ? WHERE id = ?`,
      [
        code?.toUpperCase().trim(),
        description || null,
        discount_type || 'percentage',
        discount_value,
        min_order_amount || null,
        max_discount_amount || null,
        usage_limit || null,
        expires_at || null,
        is_active !== false ? 1 : 0,
        id
      ]
    );

    return NextResponse.json({ message: 'Coupon updated successfully.' });
  } catch (error) {
    console.error('Error updating coupon:', error);
    return NextResponse.json({ error: 'Failed to update coupon' }, { status: 500 });
  }
}

// DELETE - Delete a coupon (admin only)
export async function DELETE(request, { params }) {
  try {
    const admin = await getAdminFromCookies();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    await query('DELETE FROM coupons WHERE id = ?', [id]);

    return NextResponse.json({ message: 'Coupon deleted successfully.' });
  } catch (error) {
    console.error('Error deleting coupon:', error);
    return NextResponse.json({ error: 'Failed to delete coupon' }, { status: 500 });
  }
}
