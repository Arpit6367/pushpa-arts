import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getCustomerFromCookies } from '@/lib/customerAuth';

// GET customer orders
export async function GET() {
  try {
    const customer = await getCustomerFromCookies();
    if (!customer) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const orders = await query(
      `SELECT * FROM orders WHERE customer_id = ? OR customer_email = ? ORDER BY created_at DESC`,
      [customer.id, customer.email]
    );

    // Get items for each order
    const ordersWithItems = await Promise.all(
      orders.map(async (order) => {
        const items = await query('SELECT * FROM order_items WHERE order_id = ?', [order.id]);
        return { ...order, items };
      })
    );

    return NextResponse.json(ordersWithItems);
  } catch (error) {
    console.error('Error fetching customer orders:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}
