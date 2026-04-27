import { getBlogs, getPageBySlug } from '@/lib/cms';
import Link from 'next/link';
import Image from 'next/image';

export async function generateMetadata() {
  const page = await getPageBySlug('blogs');
  const title = page?.title || 'The Art Journal';
  const desc = page?.meta_description || 'Stories of heritage, craftsmanship, and the art of luxury furniture making in Udaipur.';
  
  return {
    title: `${title} | Pushpa Exports`,
    description: desc,
  };
}

export default async function BlogsPage() {
  const blogs = await getBlogs(100);

  return (
    <div className="min-h-screen bg-[#FDFDFD]">
      <main className="pt-32 pb-20">
        <div className="max-w-[1400px] mx-auto px-[var(--spacing-container)]">
          <div className="text-center mb-20 reveal">
            <h4 className="text-[var(--color-accent)] uppercase tracking-[0.4em] font-bold text-[0.7rem] mb-4 block">The Art Journal</h4>
            <h1 className="text-4xl md:text-6xl font-heading text-[var(--color-text-primary)] italic">Heritage <span className="text-[var(--color-accent)]">Stories</span></h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {blogs.map((blog, index) => (
              <Link
                key={blog.id}
                href={`/blogs/${blog.slug}`}
                className="group reveal"
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="aspect-[4/5] relative overflow-hidden mb-6 bg-[#F5F5F7] rounded-sm shadow-sm group-hover:shadow-2xl transition-all duration-700">
                  {blog.image ? (
                    <Image
                      src={blog.image}
                      alt={blog.title}
                      fill
                      className="object-cover transition-transform duration-[2s] group-hover:scale-110"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-black/5 font-heading text-4xl uppercase tracking-tighter select-none rotate-12">
                      Pushpa Arts
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-700" />
                </div>
                <div className="space-y-3">
                  <span className="text-[0.65rem] uppercase tracking-[0.3em] font-bold text-[var(--color-accent)] block">
                    {new Date(blog.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </span>
                  <h3 className="text-xl md:text-2xl font-heading text-[var(--color-text-primary)] group-hover:text-[var(--color-accent)] transition-colors leading-tight">
                    {blog.title}
                  </h3>
                  <p className="text-black/60 text-sm leading-relaxed line-clamp-3 font-light">
                    {blog.excerpt}
                  </p>
                  <div className="pt-4">
                    <span className="text-[0.6rem] uppercase tracking-[0.3em] font-bold border-b border-black/10 pb-1 group-hover:border-[var(--color-accent)] transition-all">Read Story</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {blogs.length === 0 && (
            <div className="text-center py-20 text-black/40 italic font-light">
              Our artisans are currently crafting new stories. Please visit again soon.
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
