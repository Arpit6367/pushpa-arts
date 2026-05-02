import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { hashPassword, signCustomerToken } from '@/lib/customerAuth';

export async function POST(request) {
  try {
    const { first_name, last_name, email, phone, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
    }

    // Check if customer already exists
    const existing = await query('SELECT id FROM customers WHERE email = ?', [email.toLowerCase().trim()]);
    if (existing.length > 0) {
      return NextResponse.json({ error: 'An account with this email already exists. Please login.' }, { status: 409 });
    }

    const passwordHash = await hashPassword(password);
    const result = await query(
      'INSERT INTO customers (first_name, last_name, email, phone, password_hash) VALUES (?, ?, ?, ?, ?)',
      [first_name || '', last_name || '', email.toLowerCase().trim(), phone || '', passwordHash]
    );

    const token = signCustomerToken({ customerId: result.insertId, email: email.toLowerCase().trim() });

    const response = NextResponse.json({
      success: true,
      message: 'Account created successfully',
      customer: {
        id: result.insertId,
        first_name: first_name || '',
        last_name: last_name || '',
        email: email.toLowerCase().trim(),
      }
    }, { status: 201 });

    response.cookies.set('customer_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'Failed to create account' }, { status: 500 });
  }
}
