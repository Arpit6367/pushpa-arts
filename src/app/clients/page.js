import { getClients, getPageBySlug } from '@/lib/cms';
import Image from 'next/image';

export async function generateMetadata() {
  const page = await getPageBySlug('clients');
  const title = page?.title || 'Our Global Clients';
  const desc = page?.meta_description || 'Pushpa Exports takes pride in serving royal families, luxury hotel groups, and distinguished residences globally.';

  return {
    title: `${title} | Pushpa Exports`,
    description: desc,
  };
}

export default async function ClientsPage() {
  const clients = await getClients(100);

  return (
    <div className="min-h-screen bg-[#FDFDFD]">
      <main className="pt-32 pb-20">
        <div className="max-w-[1400px] mx-auto px-[var(--spacing-container)]">
          <div className="text-center mb-20 reveal">
            <h4 className="text-[var(--color-accent)] uppercase tracking-[0.4em] font-bold text-[0.7rem] mb-4 block">Our Patrons</h4>
            <h1 className="text-4xl md:text-6xl font-heading text-[var(--color-text-primary)] italic">Trusted <span className="text-[var(--color-accent)]">Globally</span></h1>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 md:gap-12">
            {clients.map((client, index) => (
              <div
                key={client.id}
                className="group reveal bg-white p-10 border border-black/5 hover:border-[var(--color-accent)]/20 transition-all duration-500 flex flex-col items-center justify-center text-center aspect-square shadow-sm hover:shadow-xl rounded-sm"
                style={{ transitionDelay: `${index * 50}ms` }}
              >
                <div className="h-24 w-full relative mb-6 grayscale group-hover:grayscale-0 transition-all duration-700">
                  {client.logo ? (
                    <Image
                      src={client.logo}
                      alt={client.name}
                      fill
                      className="object-contain"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-black/10 font-bold uppercase tracking-widest text-xs">
                      {client.name}
                    </div>
                  )}
                </div>
                <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-black/80">{client.name}</h3>
                {client.website_url && (
                  <a
                    href={client.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[0.6rem] uppercase tracking-[0.2em] text-[var(--color-accent)] mt-4 opacity-0 group-hover:opacity-100 transition-opacity font-bold"
                  >
                    Visit Website
                  </a>
                )}
              </div>
            ))}
          </div>

          {clients.length === 0 && (
            <div className="text-center py-20 text-black/40 italic font-light">
              We take pride in our long-standing relationships with royal families and luxury brands.
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
