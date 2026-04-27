import Image from 'next/image';
import { getBlogBySlug } from '@/lib/cms';
import { notFound } from 'next/navigation';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);
  if (!blog) return {};
  
  return {
    title: `${blog.title} | Pushpa Exports Blog`,
    description: blog.meta_description || blog.excerpt || `Read our heritage story: ${blog.title}`,
  };
}

export default async function BlogDetailPage({ params }) {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);

  if (!blog) return notFound();

  return (
    <div className="min-h-screen bg-[#FDFDFD]">
      <main className="pt-32 pb-20">
        <article className="max-w-[900px] mx-auto px-[var(--spacing-container)]">
          <div className="text-center mb-16 reveal">
            <span className="text-[0.7rem] uppercase tracking-[0.4em] font-bold text-[var(--color-accent)] mb-4 block">
              {new Date(blog.created_at).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
            </span>
            <h1 className="text-4xl md:text-6xl font-heading text-[var(--color-text-primary)] leading-tight">
              {blog.title}
            </h1>
          </div>

          {blog.image && (
            <div className="aspect-video relative mb-16 overflow-hidden reveal">
              <Image
                src={blog.image}
                alt={blog.title}
                fill
                className="object-cover"
              />
            </div>
          )}

          <div
            className="prose prose-lg max-w-none prose-headings:font-heading prose-p:text-black/70 prose-p:leading-relaxed reveal"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />
        </article>
      </main>
    </div>
  );
}
