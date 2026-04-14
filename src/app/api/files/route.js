import { NextResponse } from 'next/server';
import { getAdminFromCookies } from '@/lib/auth';
import { readdir, stat, unlink } from 'fs/promises';
import path from 'path';

export async function GET() {
  try {
    const admin = await getAdminFromCookies();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'products');

    let files = [];
    try {
      const fileNames = await readdir(uploadDir);
      for (const fileName of fileNames) {
        const filePath = path.join(uploadDir, fileName);
        const fileStat = await stat(filePath);
        if (fileStat.isFile()) {
          files.push({
            name: fileName,
            path: `/uploads/products/${fileName}`,
            size: fileStat.size,
            modified: fileStat.mtime,
          });
        }
      }
    } catch {
      // Directory doesn't exist yet
    }

    // Sort by modified date descending
    files.sort((a, b) => new Date(b.modified) - new Date(a.modified));

    return NextResponse.json({ files });
  } catch (error) {
    console.error('Error listing files:', error);
    return NextResponse.json({ error: 'Failed to list files' }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const admin = await getAdminFromCookies();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { fileName } = await request.json();
    if (!fileName) {
      return NextResponse.json({ error: 'fileName is required' }, { status: 400 });
    }

    // Prevent path traversal
    const safeName = path.basename(fileName);
    const filePath = path.join(process.cwd(), 'public', 'uploads', 'products', safeName);

    await unlink(filePath);
    return NextResponse.json({ message: 'File deleted' });
  } catch (error) {
    console.error('Error deleting file:', error);
    return NextResponse.json({ error: 'Failed to delete file' }, { status: 500 });
  }
}
