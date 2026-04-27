import { getPageBySlug, getFaqs } from '@/lib/cms';
import { getStudioPageMetadata } from '@/lib/metadata';
import { notFound } from 'next/navigation';

export async function generateMetadata() {
  return getStudioPageMetadata('faq', 'Frequently asked questions about our handcrafted furniture and services.');
}

export default async function FaqPage() {
  const [page, faqs] = await Promise.all([
    getPageBySlug('faq'),
    getFaqs()
  ]);

  if (!page) return notFound();

  return (
    <main className="pt-32 pb-20 min-h-screen bg-[#FCFAF8]">
      <div className="max-w-[1000px] mx-auto px-[var(--spacing-container)]">
        <header className="mb-16 reveal">
          <p className="text-[0.6rem] uppercase tracking-[0.5em] text-[#B8860B] font-bold mb-6">Support Concierge</p>
          <h1 className="text-4xl md:text-6xl font-heading mb-6 text-[#1d1d1f] italic">
            Frequently Asked <span className="text-[#B8860B]">Questions</span>
          </h1>
          <div 
            className="prose prose-lg text-black/60 leading-relaxed font-light max-w-2xl"
            dangerouslySetInnerHTML={{ __html: page.content }}
          />
        </header>

        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <details 
              key={faq.id} 
              className={`group bg-white border border-black/5 rounded-2xl overflow-hidden hover:border-[#B8860B]/30 transition-all shadow-sm reveal stagger-${(index % 5) + 1}`}
            >
              <summary className="list-none flex items-center justify-between p-6 sm:p-8 cursor-pointer select-none">
                <span className="text-[1.1rem] font-medium text-[#1d1d1f] group-hover:text-[#B8860B] transition-colors pr-8">
                  {faq.question}
                </span>
                <span className="w-8 h-8 rounded-full bg-[#f5f5f7] flex items-center justify-center text-[#86868b] group-open:rotate-180 transition-transform">
                  ↓
                </span>
              </summary>
              <div className="px-6 sm:px-8 pb-8">
                <div 
                  className="prose prose-p:text-black/70 prose-p:leading-relaxed prose-p:font-light"
                  dangerouslySetInnerHTML={{ __html: faq.answer }}
                />
              </div>
            </details>
          ))}

          {faqs.length === 0 && (
            <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-black/10">
              <p className="text-[#86868b] italic">Our artisans are currently curating more answers for you.</p>
            </div>
          )}
        </div>

        <div className="mt-20 p-10 bg-[#1d1d1f] rounded-3xl text-center text-white">
          <h3 className="text-2xl font-heading mb-4 italic">Still have questions?</h3>
          <p className="text-white/60 mb-8 font-light">Our concierge team is available to assist you with bespoke requests and detailed inquiries.</p>
          <a 
            href="/contact" 
            className="inline-block px-10 py-4 bg-[#B8860B] text-white rounded-full font-bold uppercase tracking-widest hover:bg-[#a67a0a] transition-all"
          >
            Contact Concierge
          </a>
        </div>
      </div>
    </main>
  );
}
