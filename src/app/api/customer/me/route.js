import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getCustomerFromCookies, hashPassword, comparePassword } from '@/lib/customerAuth';

// GET current customer profile
export async function GET() {
  try {
    const customer = await getCustomerFromCookies();
    if (!customer) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Get addresses
    const addresses = await query(
      'SELECT * FROM customer_addresses WHERE customer_id = ? ORDER BY is_default DESC',
      [customer.id]
    );

    return NextResponse.json({
      ...customer,
      addresses,
    });
  } catch (error) {
    console.error('Error fetching customer:', error);
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
  }
}

// PUT update customer profile
export async function PUT(request) {
  try {
    const customer = await getCustomerFromCookies();
    if (!customer) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const body = await request.json();
    const { first_name, last_name, phone, current_password, new_password } = body;

    // Update basic info
    await query(
      'UPDATE customers SET first_name = ?, last_name = ?, phone = ? WHERE id = ?',
      [first_name || customer.first_name, last_name || customer.last_name, phone || customer.phone, customer.id]
    );

    // Change password if requested
    if (new_password) {
      if (!current_password) {
        return NextResponse.json({ error: 'Current password is required to change password' }, { status: 400 });
      }

      // Fetch password hash
      const rows = await query('SELECT password_hash FROM customers WHERE id = ?', [customer.id]);
      if (rows[0].password_hash) {
        const valid = await comparePassword(current_password, rows[0].password_hash);
        if (!valid) {
          return NextResponse.json({ error: 'Current password is incorrect' }, { status: 400 });
        }
      }

      const newHash = await hashPassword(new_password);
      await query('UPDATE customers SET password_hash = ? WHERE id = ?', [newHash, customer.id]);
    }

    return NextResponse.json({ success: true, message: 'Profile updated' });
  } catch (error) {
    console.error('Error updating customer:', error);
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}
