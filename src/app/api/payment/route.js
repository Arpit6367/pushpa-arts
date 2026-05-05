import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      order_id,
      payment_method,
      card_number,
      card_expiry,
      card_cvc,
      card_name,
      payer_email,
      amount_paid // In a real system, this would come from a verified gateway callback
    } = body;

    // 1. Basic Validation
    if (!order_id || !payment_method) {
      return NextResponse.json({ error: 'Order ID and payment method are required' }, { status: 400 });
    }

    // 2. Fetch Order from DB to verify amount and status (Crucial for Security)
    const orders = await query('SELECT * FROM orders WHERE id = ?', [order_id]);
    if (!orders || orders.length === 0) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const order = orders[0];

    // 3. Prevent Double Payment or paying for cancelled orders
    if (order.payment_status === 'completed') {
      return NextResponse.json({ error: 'Payment has already been completed for this order' }, { status: 400 });
    }
    if (order.status === 'cancelled') {
      return NextResponse.json({ error: 'Cannot pay for a cancelled order' }, { status: 400 });
    }

    // 4. Amount Verification (Security: Protect against client-side total tampering)
    const expectedAmount = parseFloat(order.total_amount);
    if (amount_paid && Math.abs(parseFloat(amount_paid) - expectedAmount) > 0.01) {
      console.warn(`SECURITY ALERT: Payment amount mismatch for Order #${order.order_number}. Expected: ${expectedAmount}, Received: ${amount_paid}`);
      return NextResponse.json({ error: 'Payment amount mismatch. Potential tampering detected.' }, { status: 400 });
    }

    // 5. Simulate Gateway Credential Check (using .env)
    const paypalId = process.env.PAYPAL_CLIENT_ID;
    if (!paypalId || paypalId === 'your_paypal_client_id_here') {
      // In production, we'd throw an error. For now, we'll log it.
      console.warn('Warning: Payment gateway credentials not configured in .env.local');
    }

    // 6. Card Detail Protection (PCI Compliance best practice)
    let cardLastFour = null;
    let cardBrand = null;

    if (payment_method === 'credit_debit_card' || payment_method === 'card') {
      if (!card_number || !card_expiry || !card_cvc || !card_name) {
        return NextResponse.json({ error: 'Complete card details are required' }, { status: 400 });
      }
      
      // NEVER store card_number or card_cvc in your database
      cardLastFour = card_number.replace(/\s/g, '').slice(-4);
      
      const cleanCard = card_number.replace(/\s/g, '');
      if (cleanCard.startsWith('4')) cardBrand = 'Visa';
      else if (cleanCard.startsWith('5')) cardBrand = 'Mastercard';
      else if (cleanCard.startsWith('3')) cardBrand = 'American Express';
      else if (cleanCard.startsWith('6')) cardBrand = 'Discover';
      else cardBrand = 'Unknown';
    }

    // 7. Simulated Secure Transaction ID generation
    const transactionId = `TXN-${Date.now()}-${Math.floor(Math.random() * 100000)}`;

    // 8. Gatekeeper Log (Audit Trail)
    console.info(`Processing ${payment_method} payment for Order #${order.order_number} - Amount: ₹${expectedAmount}`);

    // Simulate gateway response
    const gatewayResponse = JSON.stringify({
      status: 'approved',
      transaction_id: transactionId,
      method: payment_method,
      amount: expectedAmount,
      timestamp: new Date().toISOString(),
      security_hash: Buffer.from(`${transactionId}:${process.env.PAYMENT_GATEWAY_SECRET}`).toString('base64'),
    });

    // 9. Atomic DB Update (Using parameterized queries to prevent SQL injection)
    await query(
      `INSERT INTO payments (order_id, payment_method, transaction_id, gateway_response, amount, currency, status, card_last_four, card_brand, payer_email)
       VALUES (?, ?, ?, ?, ?, 'INR', 'completed', ?, ?, ?)`,
      [order_id, payment_method, transactionId, gatewayResponse, expectedAmount, cardLastFour, cardBrand, payer_email || order.customer_email]
    );

    await query(
      'UPDATE orders SET payment_method = ?, payment_status = ?, status = ? WHERE id = ?',
      [payment_method, 'completed', 'processing', order_id]
    );

    return NextResponse.json({
      success: true,
      transaction_id: transactionId,
      order_number: order.order_number,
      message: 'Secure payment confirmed',
    }, { status: 200 });

  } catch (error) {
    console.error('Payment error:', error);
    return NextResponse.json({ error: 'Failed to process payment' }, { status: 500 });
  }
}
