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
      shipping_country,
      items,
      total_amount,
      coupon_code,
      discount_amount,
      payment_method
    } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }

    // Parse name into first/last
    const nameParts = (customer_name || '').trim().split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    // 1. Recalculate Total (Security: Prevent Price Tampering)
    let serverSubtotal = 0;
    const productIds = items.map(i => i.id);
    const placeholders = productIds.map(() => '?').join(',');
    const dbProducts = await query(`SELECT id, price, sale_price FROM products WHERE id IN (${placeholders})`, productIds);
    const productMap = dbProducts.reduce((acc, p) => ({ ...acc, [p.id]: p.sale_price || p.price }), {});

    for (const item of items) {
      const dbPrice = parseFloat(productMap[item.id] || 0);
      serverSubtotal += dbPrice * parseInt(item.quantity);
    }

    let serverDiscount = 0;
    if (coupon_code) {
      const coupons = await query('SELECT * FROM coupons WHERE code = ? AND is_active = 1', [coupon_code.toUpperCase().trim()]);
      if (coupons.length > 0) {
        const c = coupons[0];
        if (!c.expires_at || new Date(c.expires_at) > new Date()) {
          serverDiscount = c.discount_type === 'percentage'
            ? (serverSubtotal * parseFloat(c.discount_value)) / 100
            : parseFloat(c.discount_value);
          if (c.max_discount_amount) serverDiscount = Math.min(serverDiscount, parseFloat(c.max_discount_amount));
        }
      }
    }

    const serverTotal = Math.max(0, serverSubtotal - serverDiscount);

    // 2. Find or create customer
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

      // Save shipping address
      await saveCustomerAddress(customerId, {
        addressType: 'shipping',
        address: shipping_address,
        city: shipping_city,
        state: shipping_state,
        zip: shipping_zip,
        country: shipping_country || 'India',
      });

      // ONLY auto-login if the customer is NEW (Security: Prevent Account Takeover)
      if (isNew) {
        customerToken = signCustomerToken({ customerId: customerRecord.id, email: customerRecord.email });
      }
    }

    // 2. Generate a temporary unique order number
    const tempOrderNumber = `TEMP-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    // 3. Insert the order
    const orderResult = await query(
      `INSERT INTO orders (order_number, customer_id, customer_name, customer_email, customer_phone, shipping_address, shipping_city, shipping_state, shipping_zip, shipping_country, total_amount, coupon_code, discount_amount, payment_method, payment_status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')`,
      [tempOrderNumber, customerId, customer_name, customer_email, customer_phone, shipping_address, shipping_city, shipping_state, shipping_zip, shipping_country || 'India', serverTotal, coupon_code || null, serverDiscount, payment_method || null]
    );

    const orderId = orderResult.insertId;
    const orderNumber = `PA-${1000 + orderId}`;

    // Update the order with the final serial order number
    await query('UPDATE orders SET order_number = ? WHERE id = ?', [orderNumber, orderId]);

    // 4. Insert order items
    for (const item of items) {
      const dbPrice = parseFloat(productMap[item.id] || 0);
      await query(
        `INSERT INTO order_items (order_id, product_id, product_name, price, quantity, total)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [orderId, item.id, item.name, dbPrice, item.quantity, dbPrice * item.quantity]
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
      order_id: orderId,
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
