import { query } from './db';
export { query };
import slugify from 'slugify';

export async function getBlogs(limit = 10, offset = 0, admin = false) {
  let sql = 'SELECT * FROM blogs';
  if (!admin) sql += ' WHERE is_active = TRUE';
  sql += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
  return await query(sql, [limit, offset]);
}

export async function getBlogBySlug(slug) {
  const rows = await query('SELECT * FROM blogs WHERE slug = ?', [slug]);
  return rows[0];
}

export async function getProjects(limit = 10, offset = 0, admin = false) {
  let sql = 'SELECT * FROM projects';
  if (!admin) sql += ' WHERE is_active = TRUE';
  sql += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
  return await query(sql, [limit, offset]);
}

export async function getClients(admin = false) {
  let sql = 'SELECT * FROM clients';
  if (!admin) sql += ' WHERE is_active = TRUE';
  sql += ' ORDER BY sort_order ASC, name ASC';
  return await query(sql);
}

export async function getFaqs(admin = false) {
  let sql = 'SELECT * FROM faqs';
  if (!admin) sql += ' WHERE is_active = TRUE';
  sql += ' ORDER BY sort_order ASC';
  return await query(sql);
}

export async function getPageBySlug(slug) {
  const rows = await query('SELECT * FROM pages WHERE slug = ?', [slug]);
  return rows[0];
}

export async function getPages(admin = false) {
  let sql = 'SELECT * FROM pages';
  if (!admin) sql += ' WHERE is_active = TRUE';
  return await query(sql);
}

export async function createPage(data) {
  const slug = slugify(data.title, { lower: true, strict: true });
  const result = await query(
    'INSERT INTO pages (title, slug, content, meta_title, meta_description, is_active) VALUES (?, ?, ?, ?, ?, ?)',
    [data.title, slug, data.content, data.meta_title, data.meta_description, data.is_active !== false]
  );
  return result.insertId;
}

export async function deletePage(id) {
  await query('DELETE FROM pages WHERE id = ?', [id]);
}

export async function createBlog(data) {
  const slug = slugify(data.title, { lower: true, strict: true });
  const result = await query(
    'INSERT INTO blogs (title, slug, content, image, excerpt, is_active, meta_title, meta_description) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [data.title, slug, data.content, data.image, data.excerpt, data.is_active !== false, data.meta_title, data.meta_description]
  );
  return result.insertId;
}

export async function updateBlog(id, data) {
  const slug = slugify(data.title, { lower: true, strict: true });
  await query(
    'UPDATE blogs SET title = ?, slug = ?, content = ?, image = ?, excerpt = ?, is_active = ?, meta_title = ?, meta_description = ? WHERE id = ?',
    [data.title, slug, data.content, data.image, data.excerpt, data.is_active !== false, data.meta_title, data.meta_description, id]
  );
}

export async function createProject(data) {
  const slug = slugify(data.title, { lower: true, strict: true });
  const result = await query(
    'INSERT INTO projects (title, slug, description, image, client_name, is_active) VALUES (?, ?, ?, ?, ?, ?)',
    [data.title, slug, data.description, data.image, data.client_name, data.is_active !== false]
  );
  return result.insertId;
}

export async function updateProject(id, data) {
  const slug = slugify(data.title, { lower: true, strict: true });
  await query(
    'UPDATE projects SET title = ?, slug = ?, description = ?, image = ?, client_name = ?, is_active = ? WHERE id = ?',
    [data.title, slug, data.description, data.image, data.client_name, data.is_active !== false, id]
  );
}

export async function createClient(data) {
  const result = await query(
    'INSERT INTO clients (name, logo, website_url, is_active, sort_order) VALUES (?, ?, ?, ?, ?)',
    [data.name, data.logo, data.website_url, data.is_active !== false, data.sort_order || 0]
  );
  return result.insertId;
}

export async function updateClient(id, data) {
  await query(
    'UPDATE clients SET name = ?, logo = ?, website_url = ?, is_active = ?, sort_order = ? WHERE id = ?',
    [data.name, data.logo, data.website_url, data.is_active !== false, data.sort_order || 0, id]
  );
}

export async function createFaq(data) {
  const result = await query(
    'INSERT INTO faqs (question, answer, is_active, sort_order) VALUES (?, ?, ?, ?)',
    [data.question, data.answer, data.is_active !== false, data.sort_order || 0]
  );
  return result.insertId;
}

export async function updateFaq(id, data) {
  await query(
    'UPDATE faqs SET question = ?, answer = ?, is_active = ?, sort_order = ? WHERE id = ?',
    [data.question, data.answer, data.is_active !== false, data.sort_order || 0, id]
  );
}

export async function updatePage(id, data) {
  await query(
    'UPDATE pages SET title = ?, content = ?, meta_title = ?, meta_description = ?, is_active = ? WHERE id = ?',
    [data.title, data.content, data.meta_title, data.meta_description, data.is_active !== false, id]
  );
}

// Hero Slides
export async function getHeroSlides(admin = false) {
  let sql = 'SELECT * FROM hero_slides';
  if (!admin) sql += ' WHERE is_active = TRUE';
  sql += ' ORDER BY sort_order ASC';
  return await query(sql);
}

export async function createHeroSlide(data) {
  const result = await query(
    'INSERT INTO hero_slides (title, subtitle, image, button_text, button_link, sort_order, is_active) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [data.title, data.subtitle, data.image, data.button_text, data.button_link, data.sort_order || 0, data.is_active !== false]
  );
  return result.insertId;
}

export async function updateHeroSlide(id, data) {
  await query(
    'UPDATE hero_slides SET title = ?, subtitle = ?, image = ?, button_text = ?, button_link = ?, sort_order = ?, is_active = ? WHERE id = ?',
    [data.title, data.subtitle, data.image, data.button_text, data.button_link, data.sort_order || 0, data.is_active !== false, id]
  );
}

// Testimonials
export async function getTestimonials(admin = false) {
  let sql = 'SELECT * FROM testimonials';
  if (!admin) sql += ' WHERE is_active = TRUE';
  sql += ' ORDER BY sort_order ASC';
  return await query(sql);
}

export async function createTestimonial(data) {
  const result = await query(
    'INSERT INTO testimonials (name, designation, content, image, rating, sort_order, is_active) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [data.name, data.designation, data.content, data.image, data.rating || 5, data.sort_order || 0, data.is_active !== false]
  );
  return result.insertId;
}

export async function updateTestimonial(id, data) {
  await query(
    'UPDATE testimonials SET name = ?, designation = ?, content = ?, image = ?, rating = ?, sort_order = ?, is_active = ? WHERE id = ?',
    [data.name, data.designation, data.content, data.image, data.rating || 5, data.sort_order || 0, data.is_active !== false, id]
  );
}

// Material Mastery
export async function getMaterialMastery(admin = false) {
  let sql = 'SELECT * FROM material_mastery';
  if (!admin) sql += ' WHERE is_active = TRUE';
  sql += ' ORDER BY sort_order ASC';
  return await query(sql);
}

export async function createMaterialMastery(data) {
  const result = await query(
    'INSERT INTO material_mastery (title, description, image, link, sort_order, is_active) VALUES (?, ?, ?, ?, ?, ?)',
    [data.title, data.description, data.image, data.link, data.sort_order || 0, data.is_active !== false]
  );
  return result.insertId;
}

export async function updateMaterialMastery(id, data) {
  await query(
    'UPDATE material_mastery SET title = ?, description = ?, image = ?, link = ?, sort_order = ?, is_active = ? WHERE id = ?',
    [data.title, data.description, data.image, data.link, data.sort_order || 0, data.is_active !== false, id]
  );
}
