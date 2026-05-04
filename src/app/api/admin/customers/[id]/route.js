import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getAdminFromCookies } from '@/lib/auth';

export async function GET(request, { params }) {
  try {
    const admin = await getAdminFromCookies();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const customerId = Number(id);

    // Fetch basic customer info
    const customers = await query('SELECT * FROM customers WHERE id = ?', [customerId]);

    if (customers.length === 0) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }

    const customer = customers[0];

    // Fetch addresses
    const addresses = await query('SELECT * FROM customer_addresses WHERE customer_id = ?', [customerId]);

    // Fetch orders
    const orders = await query(`
      SELECT * FROM orders 
      WHERE customer_id = ? 
      ORDER BY created_at DESC
    `, [customerId]);

    // Get items for each order
    const ordersWithItems = await Promise.all(orders.map(async (order) => {
      const items = await query('SELECT * FROM order_items WHERE order_id = ?', [order.id]);
      return { ...order, items };
    }));

    return NextResponse.json({
      ...customer,
      addresses,
      orders: ordersWithItems
    });
  } catch (error) {
    console.error('Error fetching customer details:', error);
    return NextResponse.json({ error: 'Failed to fetch customer details' }, { status: 500 });
  }
}
