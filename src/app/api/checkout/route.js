import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { findOrCreateCustomer, saveCustomerAddress, signCustomerToken } from '@/lib/customerAuth';

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

    // Parse name into first/last
    const nameParts = (customer_name || '').trim().split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    // 1. Find or create customer
    let customerId = null;
    let customerToken = null;
    if (customer_email) {
      const { customer: customerRecord, isNew } = await findOrCreateCustomer({
        firstName,
        lastName,
        email: customer_email,
        phone: customer_phone,
      });
      customerId = customerRecord.id;

      // Save shipping address for the customer
      await saveCustomerAddress(customerId, {
        addressType: 'shipping',
        address: shipping_address,
        city: shipping_city,
        state: shipping_state,
        zip: shipping_zip,
      });

      // Auto-login the customer
      customerToken = signCustomerToken({ customerId: customerRecord.id, email: customerRecord.email || customer_email });
    }

    // 2. Generate a temporary unique order number
    const tempOrderNumber = `TEMP-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    // 3. Insert the order
    const orderResult = await query(
      `INSERT INTO orders (order_number, customer_id, customer_name, customer_email, customer_phone, shipping_address, shipping_city, shipping_state, shipping_zip, total_amount, coupon_code, discount_amount)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [tempOrderNumber, customerId, customer_name, customer_email, customer_phone, shipping_address, shipping_city, shipping_state, shipping_zip, total_amount, coupon_code || null, discount_amount || 0]
    );

    const orderId = orderResult.insertId;
    const orderNumber = `PA-${1000 + orderId}`;

    // Update the order with the final serial order number
    await query('UPDATE orders SET order_number = ? WHERE id = ?', [orderNumber, orderId]);

    // 4. Insert order items
    for (const item of items) {
      const itemPrice = parseFloat(item.price || 0);
      await query(
        `INSERT INTO order_items (order_id, product_id, product_name, price, quantity, total)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [orderId, item.id, item.name, itemPrice, item.quantity, itemPrice * item.quantity]
      );
    }

    // 5. If a coupon was used, increment its used_count
    if (coupon_code) {
      try {
        await query(
          'UPDATE coupons SET used_count = used_count + 1 WHERE code = ? AND is_active = 1',
          [coupon_code.toUpperCase().trim()]
        );
      } catch (couponErr) {
        console.error('Failed to update coupon usage:', couponErr);
      }
    }

    const response = NextResponse.json({
      success: true,
      order_number: orderNumber,
      message: 'Order placed successfully'
    }, { status: 201 });

    // Set customer cookie for auto-login
    if (customerToken) {
      response.cookies.set('customer_token', customerToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 30,
        path: '/',
      });
    }

    return response;

  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json({ error: 'Failed to process checkout' }, { status: 500 });
  }
}
