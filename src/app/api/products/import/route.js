import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getAdminFromCookies } from '@/lib/auth';
import slugify from 'slugify';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

// Helper to parse CSV robustly
function parseCSV(csvText) {
  const lines = csvText.split(/\r?\n/);
  const result = [];
  const header = parseCSVLine(lines[0]);
  
  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;
    const values = parseCSVLine(lines[i]);
    const obj = {};
    header.forEach((h, index) => {
      obj[h.trim().toLowerCase()] = values[index] ? values[index].trim() : '';
    });
    result.push(obj);
  }
  return result;
}

function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"' && (i === 0 || line[i - 1] !== '\\')) {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.replace(/^"|"$/g, '').replace(/""/g, '"'));
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.replace(/^"|"$/g, '').replace(/""/g, '"'));
  return result;
}

async function downloadImage(url, uploadDir) {
  // If the URL is already a local path in the uploads directory, return it as is
  if (url.startsWith('/uploads/products/')) {
    return url;
  }

  try {
    const response = await fetch(url);
    if (!response.ok) return null;
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    let ext = '.jpg';
    const contentType = response.headers.get('content-type');
    if (contentType?.includes('image/png')) ext = '.png';
    else if (contentType?.includes('image/webp')) ext = '.webp';
    
    let base = 'product-img';
    try {
      const urlObj = new URL(url);
      const urlPath = urlObj.pathname;
      base = path.basename(urlPath, path.extname(urlPath)) || 'product-img';
    } catch {}
    
    // Naming format: base-name-timestamp.ext
    const timestamp = Date.now();
    const fileName = `${base.replace(/[^a-zA-Z0-9-_]/g, '-')}-${timestamp}${ext}`;
    const filePath = path.join(uploadDir, fileName);
    
    await writeFile(filePath, buffer);
    return `/uploads/products/${fileName}`;
  } catch (err) {
    console.error(`Failed to download ${url}:`, err);
    return null;
  }
}

export async function POST(request) {
  try {
    const admin = await getAdminFromCookies();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const csvText = await file.text();
    const products = parseCSV(csvText);

    if (products.length === 0) {
      return NextResponse.json({ error: 'CSV file is empty' }, { status: 400 });
    }

    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'products');
    await mkdir(uploadDir, { recursive: true });

    // Pre-cache categories
    const categoriesRows = await query('SELECT id, name FROM categories');
    const categoryMap = {};
    categoriesRows.forEach(c => {
      categoryMap[c.name.toLowerCase()] = c.id;
    });

    const results = {
      success: 0,
      failed: 0,
      errors: []
    };

    for (const p of products) {
      try {
        if (!p.name) {
          results.failed++;
          results.errors.push(`Row ${results.success + results.failed}: Name is missing`);
          continue;
        }

        const name = p.name;
        const slug = slugify(name, { lower: true, strict: true }) + '-' + Math.floor(Math.random() * 10000); // Ensure uniqueness for bulk
        const sku = p.sku || null;
        const category_name = p.category_name || '';
        const category_id = categoryMap[category_name.toLowerCase()] || null;
        const short_description = p.short_description || null;
        const description = (p.description || '').replace(/\\n/g, '\n');
        const is_featured = p.is_featured === '1' || p.is_featured?.toLowerCase() === 'true';
        const is_active = p.is_active === '0' || p.is_active?.toLowerCase() === 'false' ? false : true;
        const meta_title = p.meta_title || null;
        const meta_description = p.meta_description || null;

        const productInsert = await query(
          `INSERT INTO products (name, slug, short_description, description, sku, category_id, is_featured, is_active, meta_title, meta_description)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [name, slug, short_description, description, sku, category_id, is_featured, is_active, meta_title, meta_description]
        );

        const productId = productInsert.insertId;

        // Handle images
        if (p.image_urls) {
          const urls = p.image_urls.split(',').map(u => u.trim());
          for (let i = 0; i < urls.length; i++) {
            const uploadedPath = await downloadImage(urls[i], uploadDir);
            if (uploadedPath) {
              await query(
                'INSERT INTO product_images (product_id, file_path, alt_text, sort_order, is_primary) VALUES (?, ?, ?, ?, ?)',
                [productId, uploadedPath, name, i, i === 0]
              );
            }
          }
        }

        results.success++;
      } catch (err) {
        console.error('Error importing product:', err);
        results.failed++;
        results.errors.push(`Row ${results.success + results.failed} (${p.name || 'Unknown'}): ${err.message}`);
      }
    }

    return NextResponse.json({
      message: `Import completed: ${results.success} succeeded, ${results.failed} failed.`,
      ...results
    });

  } catch (error) {
    console.error('Import error:', error);
    return NextResponse.json({ error: 'Failed to process import' }, { status: 500 });
  }
}
