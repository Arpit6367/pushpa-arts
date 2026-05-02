import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { query } from './db';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret';
const CUSTOMER_COOKIE = 'customer_token';

export function signCustomerToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '30d' });
}

export function verifyCustomerToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}

export async function getCustomerFromCookies() {
  const cookieStore = await cookies();
  const token = cookieStore.get(CUSTOMER_COOKIE)?.value;
  if (!token) return null;
  const decoded = verifyCustomerToken(token);
  if (!decoded || !decoded.customerId) return null;

  // Fetch fresh customer data
  const rows = await query('SELECT id, first_name, last_name, email, phone, created_at FROM customers WHERE id = ?', [decoded.customerId]);
  return rows.length > 0 ? rows[0] : null;
}

export async function hashPassword(password) {
  return bcrypt.hash(password, 10);
}

export async function comparePassword(password, hash) {
  return bcrypt.compare(password, hash);
}

// Find or create a customer from checkout info
export async function findOrCreateCustomer({ firstName, lastName, email, phone, password }) {
  // Check if customer exists
  const existing = await query('SELECT * FROM customers WHERE email = ?', [email.toLowerCase().trim()]);

  if (existing.length > 0) {
    const customer = existing[0];
    // Update phone if provided and different
    if (phone && phone !== customer.phone) {
      await query('UPDATE customers SET phone = ? WHERE id = ?', [phone, customer.id]);
    }
    return { customer, isNew: false };
  }

  // Create new customer
  const passwordHash = password ? await hashPassword(password) : null;
  const result = await query(
    'INSERT INTO customers (first_name, last_name, email, phone, password_hash) VALUES (?, ?, ?, ?, ?)',
    [firstName || '', lastName || '', email.toLowerCase().trim(), phone || '', passwordHash]
  );

  const newCustomer = {
    id: result.insertId,
    first_name: firstName || '',
    last_name: lastName || '',
    email: email.toLowerCase().trim(),
    phone: phone || '',
  };

  return { customer: newCustomer, isNew: true };
}

// Save or update a customer address
export async function saveCustomerAddress(customerId, { addressType, address, city, state, zip }) {
  // Check for existing address of this type
  const existing = await query(
    'SELECT id FROM customer_addresses WHERE customer_id = ? AND address_type = ?',
    [customerId, addressType || 'shipping']
  );

  if (existing.length > 0) {
    await query(
      'UPDATE customer_addresses SET address_line = ?, city = ?, state = ?, zip = ? WHERE id = ?',
      [address, city, state, zip, existing[0].id]
    );
    return existing[0].id;
  }

  const result = await query(
    'INSERT INTO customer_addresses (customer_id, address_type, address_line, city, state, zip, is_default) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [customerId, addressType || 'shipping', address, city, state, zip, true]
  );
  return result.insertId;
}
