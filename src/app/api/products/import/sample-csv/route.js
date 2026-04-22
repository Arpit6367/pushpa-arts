import { NextResponse } from 'next/server';

export async function GET() {
  const headers = [
    'name',
    'sku',
    'category_name',
    'short_description',
    'description',
    'is_featured',
    'is_active',
    'meta_title',
    'meta_description',
    'image_urls'
  ].join(',');

  const rows = [
    [
      'Luxury Silver Chair',
      'SC-001',
      'Silver Furniture',
      'Exquisite hand-carved silver chair.',
      'This luxury silver chair is handcrafted by skilled artisans using pure silver sheets on solid teak wood.',
      '1',
      '1',
      'Luxury Silver Chair | Pushpa Exports',
      'Buy exquisite hand-carved silver chair from Pushpa Exports.',
      '/uploads/products/tutor-new-removebg-preview-1776086705928.png'
    ].map(val => `"${val.replace(/"/g, '""')}"`).join(','),
    [
      'Bone Inlay Coffee Table',
      'BI-CT-02',
      'Bone Inlay Furniture',
      'Handcrafted floral bone inlay coffee table.',
      'Beautiful coffee table featuring intricate floral bone inlay work on a sturdy wooden frame.',
      '0',
      '1',
      'Bone Inlay Coffee Table | Pushpa Exports',
      'Discover our unique collection of bone inlay furniture.',
      '/uploads/products/bone_inlay_table.png'
    ].map(val => `"${val.replace(/"/g, '""')}"`).join(',')
  ];

  const csvContent = headers + '\n' + rows.join('\n');

  return new NextResponse(csvContent, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': 'attachment; filename=products_import_sample.csv',
    },
  });
}
