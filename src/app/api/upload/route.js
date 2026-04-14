import { NextResponse } from 'next/server';
import { getAdminFromCookies } from '@/lib/auth';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(request) {
  try {
    const admin = await getAdminFromCookies();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const files = formData.getAll('files');

    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'No files provided' }, { status: 400 });
    }

    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'products');
    await mkdir(uploadDir, { recursive: true });

    const uploadedFiles = [];

    for (const file of files) {
      if (!file || typeof file === 'string') continue;

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Create unique filename
      const ext = path.extname(file.name);
      const baseName = path.basename(file.name, ext).replace(/[^a-zA-Z0-9-_]/g, '-');
      const timestamp = Date.now();
      const fileName = `${baseName}-${timestamp}${ext}`;
      const filePath = path.join(uploadDir, fileName);

      await writeFile(filePath, buffer);

      uploadedFiles.push({
        file_path: `/uploads/products/${fileName}`,
        original_name: file.name,
        size: buffer.length,
      });
    }

    return NextResponse.json({ files: uploadedFiles, message: 'Files uploaded successfully' });
  } catch (error) {
    console.error('Error uploading files:', error);
    return NextResponse.json({ error: 'Failed to upload files' }, { status: 500 });
  }
}
