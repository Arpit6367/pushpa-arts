import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

// POST - Validate and apply a coupon code (public)
export async function POST(request) {
  try {
    const body = await request.json();
    const { code, cart_total } = body;

    if (!code) {
      return NextResponse.json({ error: 'Please enter a coupon code.' }, { status: 400 });
    }

    const coupons = await query('SELECT * FROM coupons WHERE code = ? AND is_active = 1', [code.toUpperCase().trim()]);

    if (coupons.length === 0) {
      return NextResponse.json({ error: 'Invalid coupon code. Please check and try again.' }, { status: 404 });
    }

    const coupon = coupons[0];

    // Check expiry
    if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) {
      return NextResponse.json({ error: 'This coupon has expired.' }, { status: 400 });
    }

    // Check usage limit
    if (coupon.usage_limit && coupon.used_count >= coupon.usage_limit) {
      return NextResponse.json({ error: 'This coupon has reached its usage limit.' }, { status: 400 });
    }

    // Check minimum order amount
    if (coupon.min_order_amount && cart_total < parseFloat(coupon.min_order_amount)) {
      return NextResponse.json({
        error: `Minimum order amount of ₹${parseFloat(coupon.min_order_amount).toLocaleString()} is required for this coupon.`
      }, { status: 400 });
    }

    // Calculate discount
    let discountAmount = 0;
    if (coupon.discount_type === 'percentage') {
      discountAmount = (cart_total * parseFloat(coupon.discount_value)) / 100;
      // Apply max discount cap if set
      if (coupon.max_discount_amount && discountAmount > parseFloat(coupon.max_discount_amount)) {
        discountAmount = parseFloat(coupon.max_discount_amount);
      }
    } else {
      // Fixed discount
      discountAmount = parseFloat(coupon.discount_value);
    }

    // Ensure discount doesn't exceed cart total
    if (discountAmount > cart_total) {
      discountAmount = cart_total;
    }

    return NextResponse.json({
      valid: true,
      coupon: {
        id: coupon.id,
        code: coupon.code,
        description: coupon.description,
        discount_type: coupon.discount_type,
        discount_value: parseFloat(coupon.discount_value),
        max_discount_amount: coupon.max_discount_amount ? parseFloat(coupon.max_discount_amount) : null,
      },
      discount_amount: Math.round(discountAmount * 100) / 100,
      message: `Coupon "${coupon.code}" applied! You save ₹${Math.round(discountAmount).toLocaleString()}.`
    });
  } catch (error) {
    console.error('Error validating coupon:', error);
    return NextResponse.json({ error: 'Failed to validate coupon. Please try again.' }, { status: 500 });
  }
}
