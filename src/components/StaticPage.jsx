import { getPageBySlug } from '@/lib/cms';
import { notFound } from 'next/navigation';

export default async function StaticPage({ slug }) {
  const page = await getPageBySlug(slug);

  if (!page || !page.is_active) {
    return notFound();
  }

  return (
    <main className="pt-32 pb-20 min-h-screen">
      <div className="max-w-[900px] mx-auto px-[var(--spacing-container)]">
        <h1 className="text-4xl md:text-5xl font-heading mb-10 text-[#1d1d1f]">{page.title}</h1>
        <div 
          className="prose prose-lg max-w-none prose-headings:font-heading prose-p:text-black/70 prose-p:leading-relaxed prose-a:text-[#0071e3] prose-img:rounded-2xl"
          dangerouslySetInnerHTML={{ __html: page.content }}
        />
        <div className="mt-20 pt-8 border-t border-black/5 text-[0.8rem] text-[#86868b] uppercase tracking-widest font-medium">
          Last Updated: {new Date(page.updated_at || page.created_at).toLocaleDateString()}
        </div>
      </div>
    </main>
  );
}
