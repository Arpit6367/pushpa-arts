import { getPageBySlug, getPages, getBlogs, getProjects } from '@/lib/cms';
import { getAllCategoriesWithPaths } from '@/lib/categories';
import { getStudioPageMetadata } from '@/lib/metadata';
import Link from 'next/link';

export async function generateMetadata() {
  return getStudioPageMetadata('sitemap', 'Complete directory of luxury handcrafted furniture collections, heritage stories, and global projects.');
}

export default async function SitemapPage() {
  const [
    page,
    categories,
    pages,
    blogs,
    projects
  ] = await Promise.all([
    getPageBySlug('sitemap'),
    getAllCategoriesWithPaths(),
    getPages(),
    getBlogs(100), // Get a larger limit for sitemap
    getProjects(100)
  ]);

  const siteSections = [
    {
      title: 'Our Collections',
      links: categories.filter(c => c.is_active).map(c => ({
        name: c.name,
        href: `/product-category/${c.slug_path}`
      }))
    },
    {
      title: 'Studio Pages',
      links: pages.filter(p => p.slug !== 'sitemap').map(p => ({
        name: p.title,
        href: `/${p.slug === 'home' ? '' : p.slug}`
      }))
    },
    {
      title: 'Heritage Blogs',
      links: blogs.map(b => ({
        name: b.title,
        href: `/blogs/${b.slug}`
      }))
    },
    {
      title: 'Global Projects',
      links: projects.map(p => ({
        name: p.title,
        href: `/projects#${p.slug}` // Projects are usually on a single page gallery
      }))
    }
  ];

  return (
    <main className="pt-32 pb-20 min-h-screen bg-[#FCFAF8]">
      <div className="max-w-[1200px] mx-auto px-[var(--spacing-container)]">
        <header className="mb-16 text-center">
          <p className="text-[0.6rem] uppercase tracking-[0.5em] text-[#B8860B] font-bold mb-6">Directory</p>
          <h1 className="text-4xl md:text-6xl font-heading mb-6 text-[#1d1d1f] italic">
            Visual <span className="text-[#B8860B]">Sitemap</span>
          </h1>
          {page?.content && (
            <div 
              className="prose prose-lg text-black/60 leading-relaxed font-light mx-auto"
              dangerouslySetInnerHTML={{ __html: page.content }}
            />
          )}
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 sm:gap-16">
          {siteSections.map((section) => (
            <div key={section.title}>
              <h3 className="text-[0.7rem] uppercase tracking-[0.3em] text-[#B8860B] font-bold mb-8 pb-4 border-b border-[#B8860B]/20">
                {section.title}
              </h3>
              <ul className="space-y-4">
                {section.links.map(link => (
                  <li key={link.href}>
                    <Link 
                      href={link.href}
                      className="text-[#1d1d1f] text-[1rem] font-light hover:text-[#B8860B] hover:translate-x-1 transition-all inline-block"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
                {section.links.length === 0 && (
                  <li className="text-[#86868b] italic text-sm">No entries found.</li>
                )}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-24 pt-12 border-t border-black/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-[0.8rem] text-[#86868b] uppercase tracking-widest font-medium">
            Pushpa Exports • Artisan Directory
          </div>
          <Link 
            href="/"
            className="text-[#B8860B] text-[0.85rem] font-semibold uppercase tracking-widest hover:underline"
          >
            Return to Gallery →
          </Link>
        </div>
      </div>
    </main>
  );
}
