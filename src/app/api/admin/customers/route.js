import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getAdminFromCookies } from '@/lib/auth';

export async function GET() {
  try {
    const admin = await getAdminFromCookies();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch customers with their order count and total spend
    const customers = await query(`
      SELECT 
        c.*, 
        COUNT(o.id) as order_count,
        SUM(o.total_amount) as total_spend
      FROM customers c
      LEFT JOIN orders o ON c.id = o.customer_id
      GROUP BY c.id
      ORDER BY c.created_at DESC
    `);

    return NextResponse.json(customers);
  } catch (error) {
    console.error('Error fetching customers:', error);
    return NextResponse.json({ error: 'Failed to fetch customers' }, { status: 500 });
  }
}
