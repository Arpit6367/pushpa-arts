import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getAdminFromCookies } from '@/lib/auth';

// POST - Submit a new contact inquiry (public)
export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, phone, subject, message } = body;

    // Validation
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'Name, email, subject, and message are required.' },
        { status: 400 }
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Please provide a valid email address.' },
        { status: 400 }
      );
    }

    // Rate limiting: check if same email submitted in last 2 minutes
    const recentSubmission = await query(
      'SELECT id FROM contact_inquiries WHERE email = ? AND created_at > DATE_SUB(NOW(), INTERVAL 2 MINUTE)',
      [email]
    );

    if (recentSubmission.length > 0) {
      return NextResponse.json(
        { error: 'You have already submitted an inquiry recently. Please wait a moment before trying again.' },
        { status: 429 }
      );
    }

    const result = await query(
      `INSERT INTO contact_inquiries (name, email, phone, subject, message) VALUES (?, ?, ?, ?, ?)`,
      [name.trim(), email.trim(), phone?.trim() || null, subject.trim(), message.trim()]
    );

    return NextResponse.json(
      { id: result.insertId, message: 'Your inquiry has been received. We will get back to you shortly.' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating contact inquiry:', error);
    return NextResponse.json(
      { error: 'Failed to submit inquiry. Please try again later.' },
      { status: 500 }
    );
  }
}

// GET - Fetch all inquiries (admin only)
export async function GET(request) {
  try {
    const admin = await getAdminFromCookies();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = (page - 1) * limit;

    let sql = 'SELECT * FROM contact_inquiries';
    let countSql = 'SELECT COUNT(*) as total FROM contact_inquiries';

    const conditions = [];
    const params = [];

    if (status && status !== 'all') {
      conditions.push('status = ?');
      params.push(status);
    }

    if (search) {
      conditions.push('(name LIKE ? OR email LIKE ? OR subject LIKE ? OR message LIKE ?)');
      params.push(`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`);
    }

    if (conditions.length > 0) {
      const whereClause = ' WHERE ' + conditions.join(' AND ');
      sql += whereClause;
      countSql += whereClause;
    }

    sql += ' ORDER BY created_at DESC';
    sql += ` LIMIT ${limit} OFFSET ${offset}`;

    const inquiries = await query(sql, params);
    const countResult = await query(countSql, params);
    const total = countResult[0]?.total || 0;

    // Count by status for filters
    const statusCounts = await query(
      `SELECT status, COUNT(*) as count FROM contact_inquiries GROUP BY status`
    );

    return NextResponse.json({
      inquiries,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
      statusCounts: statusCounts.reduce((acc, s) => ({ ...acc, [s.status]: s.count }), {}),
    });
  } catch (error) {
    console.error('Error fetching contact inquiries:', error);
    return NextResponse.json({ error: 'Failed to fetch inquiries' }, { status: 500 });
  }
}
