import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getCustomerFromCookies } from '@/lib/customerAuth';

// GET customer addresses
export async function GET() {
  try {
    const customer = await getCustomerFromCookies();
    if (!customer) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const addresses = await query(
      'SELECT * FROM customer_addresses WHERE customer_id = ? ORDER BY is_default DESC, created_at DESC',
      [customer.id]
    );

    return NextResponse.json(addresses);
  } catch (error) {
    console.error('Error fetching addresses:', error);
    return NextResponse.json({ error: 'Failed to fetch addresses' }, { status: 500 });
  }
}

// POST add new address
export async function POST(request) {
  try {
    const customer = await getCustomerFromCookies();
    if (!customer) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { address_type, address_line, city, state, zip, is_default } = await request.json();

    if (!address_line || !city || !state || !zip) {
      return NextResponse.json({ error: 'All address fields are required' }, { status: 400 });
    }

    // If setting as default, unset other defaults of same type
    if (is_default) {
      await query(
        'UPDATE customer_addresses SET is_default = FALSE WHERE customer_id = ? AND address_type = ?',
        [customer.id, address_type || 'shipping']
      );
    }

    const result = await query(
      'INSERT INTO customer_addresses (customer_id, address_type, address_line, city, state, zip, is_default) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [customer.id, address_type || 'shipping', address_line, city, state, zip, is_default || false]
    );

    return NextResponse.json({ success: true, id: result.insertId }, { status: 201 });
  } catch (error) {
    console.error('Error adding address:', error);
    return NextResponse.json({ error: 'Failed to add address' }, { status: 500 });
  }
}

// PUT update address
export async function PUT(request) {
  try {
    const customer = await getCustomerFromCookies();
    if (!customer) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { id, address_type, address_line, city, state, zip, is_default } = await request.json();

    if (!id) {
      return NextResponse.json({ error: 'Address ID is required' }, { status: 400 });
    }

    // Verify ownership
    const existing = await query('SELECT id FROM customer_addresses WHERE id = ? AND customer_id = ?', [id, customer.id]);
    if (existing.length === 0) {
      return NextResponse.json({ error: 'Address not found' }, { status: 404 });
    }

    if (is_default) {
      await query(
        'UPDATE customer_addresses SET is_default = FALSE WHERE customer_id = ? AND address_type = ?',
        [customer.id, address_type || 'shipping']
      );
    }

    await query(
      'UPDATE customer_addresses SET address_type = ?, address_line = ?, city = ?, state = ?, zip = ?, is_default = ? WHERE id = ?',
      [address_type || 'shipping', address_line, city, state, zip, is_default || false, id]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating address:', error);
    return NextResponse.json({ error: 'Failed to update address' }, { status: 500 });
  }
}

// DELETE address
export async function DELETE(request) {
  try {
    const customer = await getCustomerFromCookies();
    if (!customer) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Address ID is required' }, { status: 400 });
    }

    await query('DELETE FROM customer_addresses WHERE id = ? AND customer_id = ?', [id, customer.id]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting address:', error);
    return NextResponse.json({ error: 'Failed to delete address' }, { status: 500 });
  }
}
