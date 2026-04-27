require('dotenv').config({ path: '.env.local' });
const mysql = require('mysql2/promise');

async function addMissingPages() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  const pages = [
    {
      slug: 'about',
      title: 'About Us',
      content: '<p>Pushpa Arts is a luxury furniture brand from Udaipur...</p>',
      meta_title: 'About Pushpa Arts | Handcrafted Luxury',
      meta_description: 'Learn about our heritage of craftsmanship.'
    },
    {
      slug: 'contact',
      title: 'Contact Us',
      content: '<p>Get in touch for bespoke inquiries.</p>',
      meta_title: 'Contact Pushpa Arts',
      meta_description: 'Connect with our artisans.'
    },
    {
      slug: 'faq',
      title: 'Frequently Asked Questions',
      content: '<p>Find answers to common questions about our crafts and shipping.</p>',
      meta_title: 'FAQ | Pushpa Arts',
      meta_description: 'Got questions? We have answers.'
    },
    {
      slug: 'sitemap',
      title: 'Sitemap',
      content: '<p>Explore all sections of our studio gallery.</p>',
      meta_title: 'Sitemap | Pushpa Arts',
      meta_description: 'Site structure and navigation.'
    }
  ];

  try {
    for (const page of pages) {
      await connection.execute(
        `INSERT INTO pages (slug, title, content, meta_title, meta_description) 
         VALUES (?, ?, ?, ?, ?) 
         ON DUPLICATE KEY UPDATE slug=slug`, 
        [page.slug, page.title, page.content, page.meta_title, page.meta_description]
      );
    }
    console.log('✅ Missing pages added.');
  } catch (err) {
    console.error(err);
  } finally {
    await connection.end();
  }
}

addMissingPages();
