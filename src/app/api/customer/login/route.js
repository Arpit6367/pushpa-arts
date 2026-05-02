import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { comparePassword, signCustomerToken } from '@/lib/customerAuth';

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const rows = await query('SELECT * FROM customers WHERE email = ?', [email.toLowerCase().trim()]);
    if (rows.length === 0) {
      return NextResponse.json({ error: 'No account found with this email' }, { status: 401 });
    }

    const customer = rows[0];

    if (!customer.password_hash) {
      return NextResponse.json({ error: 'Please set a password first. Use the registration form with your email.' }, { status: 401 });
    }

    const valid = await comparePassword(password, customer.password_hash);
    if (!valid) {
      return NextResponse.json({ error: 'Incorrect password' }, { status: 401 });
    }

    const token = signCustomerToken({ customerId: customer.id, email: customer.email });

    const response = NextResponse.json({
      success: true,
      customer: {
        id: customer.id,
        first_name: customer.first_name,
        last_name: customer.last_name,
        email: customer.email,
      }
    });

    response.cookies.set('customer_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  }
}
