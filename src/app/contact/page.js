'use client';
import { useState } from 'react';
import Image from 'next/image';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Something went wrong. Please try again.');
        return;
      }

      setSubmitted(true);
      setForm({ name: '', email: '', phone: '', subject: '', message: '' });
      setTimeout(() => setSubmitted(false), 8000);
    } catch (err) {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ContactPage",
            "name": "Contact Pushpa Arts",
            "description": "Get in touch with Pushpa Arts for inquiries about our luxury handcrafted furniture from Udaipur, India.",
            "mainEntity": {
              "@type": "Organization",
              "name": "Pushpa Arts",
              "telephone": "+91-94141-62629",
              "email": "info@pushpaarts.com",
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "Udaipur",
                "addressRegion": "Rajasthan",
                "addressCountry": "India"
              }
            }
          })
        }}
      />

      {/* Hero Section */}
      <div className="relative h-[60vh] md:h-[85vh] min-h-[350px] md:min-h-[400px] flex items-center overflow-hidden">
        <Image
          src="/images/contact_hero.png"
          alt="Pushpa Arts Studio"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70"></div>
        <div className="container relative z-10 text-white text-center">
          <div className="max-w-[800px] mx-auto">
            <p className="text-[0.6rem] uppercase tracking-[0.5em] text-[#B8860B] font-bold mb-6 reveal stagger-1">Get In Touch</p>
            <h1 className="text-[clamp(2.8rem,7vw,5rem)] font-heading leading-tight mb-6 reveal stagger-2">
              Connect With <span className="text-[#B8860B] italic">Artisans</span>
            </h1>
            <div className="w-24 h-[2px] bg-gradient-to-r from-transparent via-[#B8860B] to-transparent mx-auto mb-8 reveal stagger-3"></div>
            <p className="text-[1rem] md:text-[1.2rem] font-light leading-relaxed opacity-70 uppercase tracking-[0.15em] reveal stagger-4">
              Udaipur • India • Worldwide
            </p>
          </div>
        </div>
      </div>

      <div className="bg-[#F5F1EE] py-6 border-b border-[#E5E0DA]">
        <div className="container">
          <div className="flex flex-wrap items-center gap-2 text-[0.7rem] tracking-[0.2em] uppercase text-[#1F1F1F]">
            <a href="/" className="opacity-60 hover:opacity-100 transition-opacity">Home</a>
            <span className="opacity-30">/</span>
            <span className="font-semibold text-[#B8860B]">Contact</span>
          </div>
        </div>
      </div>

      <section className="py-[clamp(5rem,10vw,9rem)] bg-[#FCFAF8]">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-12 lg:gap-32">
            {/* Contact Info */}
            <div className="reveal">
              <h2 className="font-heading text-[clamp(2.2rem,5vw,3.5rem)] text-[#1F1F1F] mb-8 leading-tight">
                An Invitation to <br />
                <span className="text-[#B8860B] italic">Collaborate</span>
              </h2>
              <p className="text-[#4A4A4A] mb-12 leading-[2.1] text-[1.1rem] font-light">
                Whether you are looking for a singular statement piece for your home or seeking a long-term manufacturing partner for luxury interiors, we are here to assist you with royal attention to detail.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                <div className="space-y-10">
                  <div className="flex flex-col gap-4">
                    <h4 className="text-[0.65rem] font-bold uppercase tracking-[0.3em] text-[#B8860B]">Main Atelier</h4>
                    <p className="text-[#1F1F1F] text-[0.95rem] font-light leading-relaxed">
                      Opp. Fatehsagar Lake,<br />
                      Udaipur, Rajasthan 313001<br />
                      India
                    </p>
                  </div>

                  <div className="flex flex-col gap-4">
                    <h4 className="text-[0.65rem] font-bold uppercase tracking-[0.3em] text-[#B8860B]">Direct Inquiry</h4>
                    <p className="text-[#1F1F1F] text-[0.95rem] font-light">
                      <a href="mailto:info@pushpaarts.com" className="hover:text-[#B8860B] transition-colors underline underline-offset-4">info@pushpaarts.com</a><br />
                      <span className="block mt-2">+91 94141 62629</span>
                    </p>
                  </div>
                </div>

                <div className="space-y-10">
                  <div className="flex flex-col gap-4">
                    <h4 className="text-[0.65rem] font-bold uppercase tracking-[0.3em] text-[#B8860B]">Social Connect</h4>
                    <div className="flex flex-col gap-3">
                      <a href="#" className="text-[#1F1F1F] text-[0.95rem] font-light hover:text-[#B8860B] transition-colors">Instagram</a>
                      <a href="#" className="text-[#1F1F1F] text-[0.95rem] font-light hover:text-[#B8860B] transition-colors">Pinterest</a>
                      <a href="https://wa.me/919414162629" className="text-[#1F1F1F] text-[0.95rem] font-light hover:text-[#B8860B] transition-colors">WhatsApp Direct</a>
                    </div>
                  </div>

                  <div className="flex flex-col gap-4">
                    <h4 className="text-[0.65rem] font-bold uppercase tracking-[0.3em] text-[#B8860B]">Business Hours</h4>
                    <p className="text-[#1F1F1F] text-[0.95rem] font-light leading-relaxed">
                      Mon — Sat: 10:00 — 20:00<br />
                      Sunday: By Appointment Only
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="reveal lg:mt-[-8rem] z-20 relative">
              <div className="bg-white p-[clamp(2rem,6vw,4.5rem)] rounded-[4px] border border-[#F0EDE6] shadow-[0_30px_100px_rgba(0,0,0,0.05)]">
                <h3 className="font-heading text-2xl sm:text-3xl text-[#1F1F1F] mb-8 sm:mb-10 italic">
                  Private Inquiry <span className="text-[#B8860B]">Form</span>
                </h3>

                {submitted && (
                  <div className="p-6 bg-[#FCFAF8] border-l-4 border-[#B8860B] text-[#B8860B] mb-10 text-[0.95rem] italic animate-fade-in">
                    Thank you. Your message has been received by our artisans. We will reach out to you shortly.
                  </div>
                )}

                {error && (
                  <div className="p-6 bg-red-50 border-l-4 border-red-400 text-red-600 mb-10 text-[0.95rem] animate-fade-in">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
                    <div className="flex flex-col gap-3">
                      <label htmlFor="contact-name" className="text-[0.6rem] font-bold text-[#1F1F1F] uppercase tracking-[0.2em]">Name</label>
                      <input
                        id="contact-name"
                        type="text"
                        className="bg-transparent border-b border-[#E5E0DA] py-3 text-[1rem] w-full focus:border-[#B8860B] outline-none transition-colors"
                        value={form.name}
                        onChange={e => setForm({ ...form, name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="flex flex-col gap-3">
                      <label htmlFor="contact-email" className="text-[0.6rem] font-bold text-[#1F1F1F] uppercase tracking-[0.2em]">Email</label>
                      <input
                        id="contact-email"
                        type="email"
                        className="bg-transparent border-b border-[#E5E0DA] py-3 text-[1rem] w-full focus:border-[#B8860B] outline-none transition-colors"
                        value={form.email}
                        onChange={e => setForm({ ...form, email: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
                    <div className="flex flex-col gap-3">
                      <label htmlFor="contact-phone" className="text-[0.6rem] font-bold text-[#1F1F1F] uppercase tracking-[0.2em]">Phone</label>
                      <input
                        id="contact-phone"
                        type="tel"
                        className="bg-transparent border-b border-[#E5E0DA] py-3 text-[1rem] w-full focus:border-[#B8860B] outline-none transition-colors"
                        value={form.phone}
                        onChange={e => setForm({ ...form, phone: e.target.value })}
                      />
                    </div>
                    <div className="flex flex-col gap-3">
                      <label htmlFor="contact-subject" className="text-[0.6rem] font-bold text-[#1F1F1F] uppercase tracking-[0.2em]">Interest</label>
                      <select
                        id="contact-subject"
                        className="bg-transparent border-b border-[#E5E0DA] py-3 text-[1rem] w-full focus:border-[#B8860B] outline-none transition-colors cursor-pointer"
                        value={form.subject}
                        onChange={e => setForm({ ...form, subject: e.target.value })}
                        required
                      >
                        <option value="">Select Category</option>
                        <option value="Silver Furniture">Silver Furniture</option>
                        <option value="Bone Inlay">Bone Inlay</option>
                        <option value="Mother of Pearl">Mother of Pearl</option>
                        <option value="Marble & Stone">Marble & Stone</option>
                        <option value="Custom Project">Bespoke Project</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3">
                    <label htmlFor="contact-message" className="text-[0.6rem] font-bold text-[#1F1F1F] uppercase tracking-[0.2em]">Message</label>
                    <textarea
                      id="contact-message"
                      rows="4"
                      className="bg-transparent border-b border-[#E5E0DA] py-3 text-[1rem] w-full focus:border-[#B8860B] outline-none transition-colors resize-none"
                      value={form.message}
                      onChange={e => setForm({ ...form, message: e.target.value })}
                      required
                    />
                  </div>

                  <button type="submit" disabled={loading} className="w-full bg-[#1F1F1F] text-white py-6 text-[0.7rem] font-bold uppercase tracking-[0.3em] hover:bg-[#B8860B] transition-all group overflow-hidden relative disabled:opacity-50 disabled:cursor-not-allowed">
                    <span className="relative z-10 flex items-center justify-center gap-3">
                      {loading && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>}
                      {loading ? 'Sending...' : 'Dispatch Inquiry'}
                    </span>
                    <div className="absolute inset-0 bg-[#B8860B] translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Global Presence */}
      <section className="py-[clamp(5rem,10vw,9rem)] bg-[#F5F1EE]">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="reveal">
              <h2 className="font-heading text-[clamp(2.2rem,5vw,3.5rem)] text-[#1F1F1F] mb-8 italic">
                Our <span className="text-[#B8860B]">Udaipur Showroom</span>
              </h2>
              <p className="text-[#4A4A4A] mb-8 leading-[2.1] text-[1.1rem] font-light">
                Experience the tactile beauty of our masterpieces in person. Our flagship showroom in the heart of Udaipur showcases our latest collections in a curated architectural setting.
              </p>
              <div className="aspect-video bg-[#E5E0DA] relative rounded-[4px] overflow-hidden grayscale">
                {/* Map Placeholder or Static Image */}
                <div className="absolute inset-0 flex items-center justify-center text-[#8C8C8C] text-[0.7rem] uppercase tracking-[0.2em] font-bold">
                  Interactive Gallery View Map
                </div>
              </div>
            </div>
            <div className="reveal delay-200">
              <div className="space-y-12">
                <div>
                  <h3 className="font-heading text-2xl text-[#1F1F1F] mb-4 italic">Frequently Asked <span className="text-[#B8860B]">Questions</span></h3>
                  <div className="space-y-6">
                    <details className="group border-b border-[#E5E0DA] pb-4 cursor-pointer">
                      <summary className="list-none flex items-center justify-between text-[0.95rem] font-medium text-[#1F1F1F]">
                        Do you offer international shipping?
                        <span className="group-open:rotate-180 transition-transform">↓</span>
                      </summary>
                      <p className="mt-4 text-[#8C8C8C] text-[0.9rem] font-light leading-relaxed">
                        Yes, we specialize in worldwide export. We use specialized transport and museum-grade packaging to ensure your furniture arrives safely anywhere in the world.
                      </p>
                    </details>
                    <details className="group border-b border-[#E5E0DA] pb-4 cursor-pointer">
                      <summary className="list-none flex items-center justify-between text-[0.95rem] font-medium text-[#1F1F1F]">
                        Can I request a custom design?
                        <span className="group-open:rotate-180 transition-transform">↓</span>
                      </summary>
                      <p className="mt-4 text-[#8C8C8C] text-[0.9rem] font-light leading-relaxed">
                        Absolutely. Bespoke creations are at the heart of Pushpa Arts. We can modify existing designs or create entirely new pieces based on your architectural requirements.
                      </p>
                    </details>
                    <details className="group border-b border-[#E5E0DA] pb-4 cursor-pointer">
                      <summary className="list-none flex items-center justify-between text-[0.95rem] font-medium text-[#1F1F1F]">
                        What is the typical lead time?
                        <span className="group-open:rotate-180 transition-transform">↓</span>
                      </summary>
                      <p className="mt-4 text-[#8C8C8C] text-[0.9rem] font-light leading-relaxed">
                        As every piece is handcrafted, lead times vary between 8 to 14 weeks depending on the complexity of the design and materials used.
                      </p>
                    </details>
                    <details className="group border-b border-[#E5E0DA] pb-4 cursor-pointer">
                      <summary className="list-none flex items-center justify-between text-[0.95rem] font-medium text-[#1F1F1F]">
                        Do you offer international shipping?
                        <span className="group-open:rotate-180 transition-transform">↓</span>
                      </summary>
                      <p className="mt-4 text-[#8C8C8C] text-[0.9rem] font-light leading-relaxed">
                        Yes, we specialize in worldwide export. We use specialized transport and museum-grade packaging to ensure your furniture arrives safely anywhere in the world.
                      </p>
                    </details>
                    <details className="group border-b border-[#E5E0DA] pb-4 cursor-pointer">
                      <summary className="list-none flex items-center justify-between text-[0.95rem] font-medium text-[#1F1F1F]">
                        Can I request a custom design?
                        <span className="group-open:rotate-180 transition-transform">↓</span>
                      </summary>
                      <p className="mt-4 text-[#8C8C8C] text-[0.9rem] font-light leading-relaxed">
                        Absolutely. Bespoke creations are at the heart of Pushpa Arts. We can modify existing designs or create entirely new pieces based on your architectural requirements.
                      </p>
                    </details>
                    <details className="group border-b border-[#E5E0DA] pb-4 cursor-pointer">
                      <summary className="list-none flex items-center justify-between text-[0.95rem] font-medium text-[#1F1F1F]">
                        Can I request a custom design?
                        <span className="group-open:rotate-180 transition-transform">↓</span>
                      </summary>
                      <p className="mt-4 text-[#8C8C8C] text-[0.9rem] font-light leading-relaxed">
                        Absolutely. Bespoke creations are at the heart of Pushpa Arts. We can modify existing designs or create entirely new pieces based on your architectural requirements.
                      </p>
                    </details>
                    <details className="group border-b border-[#E5E0DA] pb-4 cursor-pointer">
                      <summary className="list-none flex items-center justify-between text-[0.95rem] font-medium text-[#1F1F1F]">
                        What is the typical lead time?
                        <span className="group-open:rotate-180 transition-transform">↓</span>
                      </summary>
                      <p className="mt-4 text-[#8C8C8C] text-[0.9rem] font-light leading-relaxed">
                        As every piece is handcrafted, lead times vary between 8 to 14 weeks depending on the complexity of the design and materials used.
                      </p>
                    </details>
                    <details className="group border-b border-[#E5E0DA] pb-4 cursor-pointer">
                      <summary className="list-none flex items-center justify-between text-[0.95rem] font-medium text-[#1F1F1F]">
                        Do you offer international shipping?
                        <span className="group-open:rotate-180 transition-transform">↓</span>
                      </summary>
                      <p className="mt-4 text-[#8C8C8C] text-[0.9rem] font-light leading-relaxed">
                        Yes, we specialize in worldwide export. We use specialized transport and museum-grade packaging to ensure your furniture arrives safely anywhere in the world.
                      </p>
                    </details>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}


