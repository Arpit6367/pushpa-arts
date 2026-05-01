import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function POST(request) {
  try {
    const body = await request.json();
    const { 
      customer_name, 
      customer_email, 
      customer_phone, 
      shipping_address, 
      shipping_city, 
      shipping_state, 
      shipping_zip, 
      items, 
      total_amount,
      coupon_code,
      discount_amount
    } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }

    // Generate a unique order number (e.g., PA-1714392237)
    const orderNumber = `PA-${Math.floor(Date.now() / 1000)}`;

    // 1. Insert the order
    const orderResult = await query(
      `INSERT INTO orders (order_number, customer_name, customer_email, customer_phone, shipping_address, shipping_city, shipping_state, shipping_zip, total_amount, coupon_code, discount_amount)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [orderNumber, customer_name, customer_email, customer_phone, shipping_address, shipping_city, shipping_state, shipping_zip, total_amount, coupon_code || null, discount_amount || 0]
    );

    const orderId = orderResult.insertId;

    // 2. Insert order items
    for (const item of items) {
      const itemPrice = parseFloat(item.price || 0);
      await query(
        `INSERT INTO order_items (order_id, product_id, product_name, price, quantity, total)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [orderId, item.id, item.name, itemPrice, item.quantity, itemPrice * item.quantity]
      );
    }

    // 3. If a coupon was used, increment its used_count
    if (coupon_code) {
      try {
        await query(
          'UPDATE coupons SET used_count = used_count + 1 WHERE code = ? AND is_active = 1',
          [coupon_code.toUpperCase().trim()]
        );
      } catch (couponErr) {
        // Non-critical: don't fail the order if coupon tracking fails
        console.error('Failed to update coupon usage:', couponErr);
      }
    }

    // TODO: Send confirmation email here

    return NextResponse.json({ 
      success: true, 
      order_number: orderNumber,
      message: 'Order placed successfully' 
    }, { status: 201 });

  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json({ error: 'Failed to process checkout' }, { status: 500 });
  }
}
