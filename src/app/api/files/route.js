import { NextResponse } from 'next/server';
import { getAdminFromCookies } from '@/lib/auth';
import { readdir, stat, unlink, mkdir } from 'fs/promises';
import path from 'path';

export async function GET() {
  try {
    const admin = await getAdminFromCookies();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'products');
    console.log('Admin File Manager: Listing files from', uploadDir);

    // Ensure directory exists
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch (err) {
      console.error('Error creating upload directory:', err);
    }

    let files = [];
    try {
      const fileNames = await readdir(uploadDir);
      for (const fileName of fileNames) {
        // Skip hidden files
        if (fileName.startsWith('.')) continue;

        const filePath = path.join(uploadDir, fileName);
        try {
          const fileStat = await stat(filePath);
          if (fileStat.isFile()) {
            files.push({
              name: fileName,
              path: `/uploads/products/${fileName}`,
              size: fileStat.size,
              modified: fileStat.mtime,
            });
          }
        } catch (statError) {
          console.warn(`Could not stat file ${fileName}:`, statError);
          // Continue to next file
        }
      }
    } catch (readdirError) {
      console.error('Error reading upload directory:', readdirError);
      // Return empty array if directory issues
    }

    // Sort by modified date descending
    files.sort((a, b) => new Date(b.modified) - new Date(a.modified));

    return NextResponse.json({ files });
  } catch (error) {
    console.error('CRITICAL: Error listing files in File Manager:', error);
    return NextResponse.json({ 
      error: 'Failed to list files', 
      details: error.message 
    }, { status: 500 });
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
