import { getPageBySlug } from '@/lib/cms';
import { getStudioPageMetadata } from '@/lib/metadata';
import Link from 'next/link';

export async function generateMetadata() {
  return getStudioPageMetadata('privacy-policy', 'Our commitment to protecting your privacy and data security.');
}

export default async function PrivacyPage() {
  const page = await getPageBySlug('privacy-policy');
  if (!page) return notFound();

  const sidebarSections = [
    { id: 'policy', title: 'Privacy Policy' },
    { id: 'collection', title: 'Data Collection' },
    { id: 'usage', title: 'Data Usage' }
  ];

  return (
    <main className="bg-[#FCFAF8] min-h-screen pt-32 pb-20">
      <div className="container max-w-[1200px]">
        <div className="flex flex-col lg:flex-row gap-16">
          {/* Sidebar Navigation */}
          <aside className="lg:w-1/4 hidden lg:block h-fit sticky top-32">
            <h3 className="text-[0.7rem] uppercase tracking-[0.3em] text-[#B8860B] font-bold mb-8">Privacy Index</h3>
            <ul className="space-y-4">
              {sidebarSections.map(s => (
                <li key={s.id}>
                  <a href={`#${s.id}`} className="text-[#86868b] hover:text-[#B8860B] text-sm transition-colors block py-1">
                    {s.title}
                  </a>
                </li>
              ))}
            </ul>
            <div className="mt-12 p-6 bg-white border border-black/5 rounded-2xl">
              <p className="text-xs text-[#86868b] leading-relaxed">
                Last Updated:<br />
                <strong>{new Date(page.updated_at || page.created_at).toLocaleDateString()}</strong>
              </p>
            </div>
          </aside>

          {/* Content Area */}
          <div className="lg:w-3/4">
            <header className="mb-16 reveal">
              <h1 className="text-4xl md:text-6xl font-heading mb-8 text-[#1d1d1f] italic">
                {page.title.split(' ')[0]} <span className="text-[#B8860B]">{page.title.split(' ')[1] || 'Policy'}</span>
              </h1>
              <p className="text-[#86868b] text-lg font-light leading-relaxed max-w-2xl">
                Your trust is our most valuable asset. This policy outlines how we handle your personal information with the same care and integrity we apply to our craftsmanship.
              </p>
            </header>

            <div className="space-y-16">
              <section id="policy" className="reveal border-b border-black/5 pb-12 last:border-0">
                <div 
                  className="prose prose-lg text-[#4A4A4A] font-light leading-relaxed prose-headings:font-heading prose-headings:text-2xl prose-headings:text-[#1d1d1f] prose-headings:mt-12 prose-headings:mb-6"
                  dangerouslySetInnerHTML={{ __html: page.content }}
                />
              </section>
            </div>

            <div className="mt-20 p-10 bg-[#1d1d1f] rounded-3xl text-white reveal">
              <h3 className="text-2xl font-heading mb-4 italic">Privacy Concerns?</h3>
              <p className="text-white/60 mb-8 font-light">If you have any questions about how your data is handled, our data protection officer is here to help.</p>
              <Link 
                href="/contact" 
                className="inline-block px-10 py-4 bg-[#B8860B] text-white rounded-full font-bold uppercase tracking-widest hover:bg-[#a67a0a] transition-all"
              >
                Inquire About Data
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
