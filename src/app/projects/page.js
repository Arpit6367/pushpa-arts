import { getProjects, getPageBySlug } from '@/lib/cms';
import Image from 'next/image';

export async function generateMetadata() {
  const page = await getPageBySlug('projects');
  const title = page?.title || 'Global Projects';
  const desc = page?.meta_description || 'Explore our portfolio of bespoke furniture installations for luxury hotels and private residences worldwide.';
  
  return {
    title: `${title} | Pushpa Exports`,
    description: desc,
  };
}

export default async function ProjectsPage() {
  const projects = await getProjects(100);

  return (
    <div className="min-h-screen bg-[#FDFDFD]">
      <main className="pt-32 pb-20">
        <div className="max-w-[1600px] mx-auto px-[var(--spacing-container)]">
          <div className="text-center mb-20 reveal">
            <h4 className="text-[var(--color-accent)] uppercase tracking-[0.4em] font-bold text-[0.7rem] mb-4 block">Our Exhibitions</h4>
            <h1 className="text-4xl md:text-6xl font-heading text-[var(--color-text-primary)] italic">Global <span className="text-[var(--color-accent)]">Projects</span></h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            {projects.map((project, index) => (
              <div
                key={project.id}
                className="group reveal"
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="aspect-[16/10] relative overflow-hidden mb-8 bg-[#F5F5F7] shadow-2xl rounded-sm">
                  {project.image ? (
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      className="object-cover transition-transform duration-[2s] group-hover:scale-105"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-black/5 font-heading text-6xl uppercase tracking-tighter select-none rotate-12">
                      Exhibition
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-700" />
                </div>
                <div className="max-w-[500px]">
                  <span className="text-[0.65rem] uppercase tracking-[0.3em] font-bold text-[var(--color-accent)] mb-2 block">
                    {project.client_name || 'International Showcase'}
                  </span>
                  <h3 className="text-2xl md:text-3xl font-heading text-[var(--color-text-primary)] mb-4">
                    {project.title}
                  </h3>
                  <div
                    className="text-black/60 text-[1rem] leading-relaxed mb-6 font-light"
                    dangerouslySetInnerHTML={{ __html: project.description }}
                  />
                </div>
              </div>
            ))}
          </div>

          {projects.length === 0 && (
            <div className="text-center py-20 text-black/40 italic font-light">
              New exhibitions are being curated. Check back soon.
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
