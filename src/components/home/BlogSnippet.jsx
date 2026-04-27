'use client';
import Image from 'next/image';
import Link from 'next/link';

const posts = [
  {
    image: '/images/hero-refined-1.png',
    category: 'Design Trends',
    title: 'How Bone Inlay is Reclaiming Modern Luxury Interiors',
    date: 'April 12, 2026'
  },
  {
    image: '/images/hero-luxury-3.png',
    category: 'Heritage',
    title: 'The Secret Art of Silver Foiling: A Udaipur Legacy',
    date: 'March 28, 2026'
  },
  {
    image: '/images/bespoke_interior.png',
    category: 'Style Guide',
    title: '5 Ways to Style Marble Inlay in a Contemporary Home',
    date: 'March 15, 2026'
  }
];

export default function BlogSnippet({ items = [] }) {
  const displayPosts = items.length > 0 ? items : posts;
  
  return (
    <section className="py-[var(--spacing-section)] bg-[#FDFDFD] overflow-hidden">
      <div className="max-w-[1600px] mx-auto px-[var(--spacing-container)]">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-10 reveal">
          <div className="max-w-[650px]">
            <span className="text-[var(--color-accent)] uppercase tracking-[0.4em] font-bold text-[0.55rem] mb-4 block stagger-1">Studio Journal</span>
            <h2 className="text-[clamp(2rem,5.5vw,3.2rem)] font-heading text-[var(--color-text-primary)] leading-[1.1] stagger-2">Insights into <br className="hidden md:block"/><span className="italic text-[var(--color-accent)]">Artisan Culture</span></h2>
          </div>
          <Link 
            href="/blogs" 
            className="group flex items-center gap-4 text-[0.65rem] uppercase tracking-[0.2em] font-bold text-[var(--color-text-primary)] stagger-3 mb-2"
          >
            <span className="border-b border-black/20 pb-1 group-hover:border-black transition-all">Read All Stories</span>
            <span className="w-8 h-[1px] bg-black/10 group-hover:w-12 group-hover:bg-black transition-all duration-700"></span>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
          {displayPosts.slice(0, 3).map((post, i) => (
            <Link key={i} href={`/blogs/${post.slug || ''}`} className={`group block reveal stagger-${i+1}`}>
              <div className="relative aspect-[1.4] overflow-hidden mb-10 shadow-2xl shadow-black/[0.02]">
                {post.image ? (
                  <Image 
                    src={post.image} 
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-[2.5s] cubic-bezier(0.16, 1, 0.3, 1) group-hover:scale-110"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gray-100"></div>
                )}
                <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              </div>
              
              <div className="flex items-center gap-4 mb-6">
                <span className="text-[0.6rem] uppercase tracking-[0.4em] font-bold text-[var(--color-accent)]">{post.category || 'Journal'}</span>
                <span className="w-8 h-[1px] bg-[var(--color-accent)]/30"></span>
              </div>
              
              <h3 className="text-xl md:text-2xl font-heading text-[var(--color-text-primary)] mb-6 leading-[1.3] group-hover:text-[var(--color-accent)] transition-colors duration-500">
                {post.title}
              </h3>
              
              <div className="flex items-center justify-between mt-auto pt-6 border-t border-black/[0.03]">
                <p className="text-[0.55rem] uppercase tracking-[0.2em] text-black/30 font-bold">
                  {post.created_at ? new Date(post.created_at).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' }) : post.date || ''}
                </p>
                <span className="text-[0.6rem] uppercase tracking-[0.3em] font-bold text-black/20 group-hover:text-[var(--color-accent)] group-hover:translate-x-2 transition-all duration-500">Read More →</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
