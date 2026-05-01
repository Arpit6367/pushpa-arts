import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getAdminFromCookies } from '@/lib/auth';
import slugify from 'slugify';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

// Robust CSV Parser that handles multi-line quoted fields
function parseCSV(csvText) {
  const rows = [];
  let currentRow = [];
  let currentField = '';
  let inQuotes = false;

  for (let i = 0; i < csvText.length; i++) {
    const char = csvText[i];
    const nextChar = csvText[i + 1];

    if (inQuotes) {
      if (char === '"') {
        if (nextChar === '"') {
          // Escaped quote
          currentField += '"';
          i++;
        } else {
          // End of quote
          inQuotes = false;
        }
      } else {
        currentField += char;
      }
    } else {
      if (char === '"') {
        inQuotes = true;
      } else if (char === ',') {
        currentRow.push(currentField);
        currentField = '';
      } else if (char === '\n' || (char === '\r' && nextChar === '\n')) {
        currentRow.push(currentField);
        rows.push(currentRow);
        currentRow = [];
        currentField = '';
        if (char === '\r') i++; // Skip the \n
      } else {
        currentField += char;
      }
    }
  }
  
  if (currentRow.length > 0 || currentField) {
    currentRow.push(currentField);
    rows.push(currentRow);
  }

  const header = rows[0].map(h => h.trim().toLowerCase());
  const result = [];

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    if (row.length === 0 || (row.length === 1 && !row[0].trim())) continue;
    
    const obj = {};
    header.forEach((h, index) => {
      obj[h] = row[index] ? row[index].trim() : '';
    });
    result.push(obj);
  }
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
        // Map headers (supporting both lowercase internal names and WooCommerce style)
        const name = p.name || p['title'];
        if (!name) {
          results.failed++;
          results.errors.push(`Row ${results.success + results.failed}: Name is missing`);
          continue;
        }

        const slug = slugify(name, { lower: true, strict: true }) + '-' + Math.floor(Math.random() * 10000);
        const sku = p.sku || null;
        
        // E-commerce fields from WooCommerce CSV
        const price = parseFloat(p['regular price'] || p['price'] || 0) || null;
        const sale_price = parseFloat(p['sale price'] || p['sale_price'] || 0) || null;
        const weight = parseFloat(p['weight (kg)'] || p['weight'] || 0) || null;
        const length = parseFloat(p['length (cm)'] || p['length'] || 0) || null;
        const width = parseFloat(p['width (cm)'] || p['width'] || 0) || null;
        const height = parseFloat(p['height (cm)'] || p['height'] || 0) || null;

        // Categories handling
        const category_name = p['categories'] || p['category_name'] || '';
        let category_id = null;
        
        // If multiple categories are provided (comma-separated), take the first one or the primary one
        const catList = category_name.split(',').map(c => c.trim().toLowerCase());
        if (catList.length > 0) {
          category_id = categoryMap[catList[0]] || null;
        }

        const short_description = p['short description'] || p['short_description'] || null;
        const description = (p['description'] || '').replace(/\\n/g, '\n');
        
        const is_featured = p['is featured?'] === '1' || p['is_featured'] === '1' || p['is_featured']?.toLowerCase() === 'true';
        const is_active = p['is_active'] === '0' || p['is_active']?.toLowerCase() === 'false' ? false : true;
        
        // SEO fields
        const meta_title = p['meta: _yoast_wpseo_title'] || p['meta_title'] || null;
        const meta_description = p['meta: _yoast_wpseo_metadesc'] || p['meta_description'] || null;

        const productInsert = await query(
          `INSERT INTO products (name, slug, short_description, description, sku, price, sale_price, weight, length, width, height, category_id, is_featured, is_active, meta_title, meta_description)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [name, slug, short_description, description, sku, price, sale_price, weight, length, width, height, category_id, is_featured, is_active, meta_title, meta_description]
        );

        const productId = productInsert.insertId;

        // Handle images (WooCommerce uses 'Images' column with comma-separated URLs)
        const imageField = p['images'] || p['image_urls'];
        if (imageField) {
          const urls = imageField.split(',').map(u => u.trim()).filter(u => u);
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
