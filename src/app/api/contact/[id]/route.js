import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getAdminFromCookies } from '@/lib/auth';

// GET - Fetch a single inquiry
export async function GET(request, { params }) {
  try {
    const admin = await getAdminFromCookies();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    const results = await query('SELECT * FROM contact_inquiries WHERE id = ?', [id]);
    if (results.length === 0) {
      return NextResponse.json({ error: 'Inquiry not found' }, { status: 404 });
    }

    return NextResponse.json(results[0]);
  } catch (error) {
    console.error('Error fetching inquiry:', error);
    return NextResponse.json({ error: 'Failed to fetch inquiry' }, { status: 500 });
  }
}

// PATCH - Update inquiry status / admin notes
export async function PATCH(request, { params }) {
  try {
    const admin = await getAdminFromCookies();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { status, admin_notes } = body;

    const updates = [];
    const updateParams = [];

    if (status) {
      updates.push('status = ?');
      updateParams.push(status);
    }

    if (admin_notes !== undefined) {
      updates.push('admin_notes = ?');
      updateParams.push(admin_notes);
    }

    if (updates.length === 0) {
      return NextResponse.json({ error: 'No fields to update' }, { status: 400 });
    }

    updateParams.push(id);
    await query(
      `UPDATE contact_inquiries SET ${updates.join(', ')} WHERE id = ?`,
      updateParams
    );

    return NextResponse.json({ message: 'Inquiry updated successfully' });
  } catch (error) {
    console.error('Error updating inquiry:', error);
    return NextResponse.json({ error: 'Failed to update inquiry' }, { status: 500 });
  }
}

// DELETE - Delete an inquiry
export async function DELETE(request, { params }) {
  try {
    const admin = await getAdminFromCookies();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    await query('DELETE FROM contact_inquiries WHERE id = ?', [id]);

    return NextResponse.json({ message: 'Inquiry deleted successfully' });
  } catch (error) {
    console.error('Error deleting inquiry:', error);
    return NextResponse.json({ error: 'Failed to delete inquiry' }, { status: 500 });
  }
}
