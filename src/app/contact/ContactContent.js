'use client';
import { useState } from 'react';
import Image from 'next/image';

export default function ContactContent({ page, faqs = [], categories = [] }) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [document, setDocument] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSubmitted(false);

    try {
      const formData = new FormData();
      Object.keys(form).forEach(key => formData.append(key, form[key]));
      if (document) {
        formData.append('document', document);
      }

      const res = await fetch('/api/contact', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Something went wrong. Please try again.');
        return;
      }

      setSubmitted(true);
      setForm({ name: '', email: '', phone: '', subject: '', message: '' });
      setDocument(null);
      // Reset file input if possible
      const fileInput = document.getElementById('contact-document');
      if (fileInput) fileInput.value = '';
      
      setTimeout(() => setSubmitted(false), 8000);
    } catch (err) {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  }

  const isCustomContent = page && page.content && page.content.length > 200;

  if (isCustomContent) {
    return (
      <main className="pt-32 pb-20">
        <div className="max-w-[1200px] mx-auto px-[var(--spacing-container)]">
          <h1 className="text-4xl md:text-5xl font-heading mb-10">{page.title}</h1>
          <div
            className="prose prose-lg max-w-none prose-headings:font-heading prose-p:text-black/70 prose-p:leading-relaxed mb-16"
            dangerouslySetInnerHTML={{ __html: page.content }}
          />

          <div className="bg-[#fbfbfd] p-8 md:p-12 rounded-2xl border border-black/5 max-w-2xl">
            <h3 className="text-2xl font-heading mb-8">Send us a message</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input type="text" placeholder="Name" className="w-full bg-white border border-black/10 px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-[#0071e3]" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
                <input type="email" placeholder="Email" className="w-full bg-white border border-black/10 px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-[#0071e3]" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input type="tel" placeholder="Phone" className="w-full bg-white border border-black/10 px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-[#0071e3]" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
                <select className="w-full bg-white border border-black/10 px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-[#0071e3] cursor-pointer" value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} required>
                  <option value="">Select Category</option>
                  {categories.filter(c => !c.parent_id).map(category => (
                    <option key={category.id} value={category.name}>{category.name}</option>
                  ))}
                  <option value="Custom Project">Bespoke Project</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-black/50 mb-2 ml-1">Upload Document (Max 10MB)</label>
                <input 
                  type="file" 
                  className="w-full bg-white border border-black/10 px-4 py-2 rounded-lg outline-none focus:ring-2 focus:ring-[#0071e3] text-sm file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-[#1d1d1f] file:text-white"
                  onChange={e => {
                    const file = e.target.files[0];
                    if (file && file.size > 10 * 1024 * 1024) {
                      setError('File size exceeds 10MB limit.');
                      e.target.value = '';
                      setDocument(null);
                      return;
                    }
                    setError('');
                    setDocument(file);
                  }}
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                />
              </div>
              <textarea placeholder="Message" rows="5" className="w-full bg-white border border-black/10 px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-[#0071e3] resize-none" value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} required />
              <button type="submit" disabled={loading} className="bg-[#1d1d1f] text-white px-8 py-3 rounded-full font-semibold hover:bg-black transition-all disabled:opacity-50">
                {loading ? 'Sending...' : 'Send Message'}
              </button>
            </form>
            {submitted && <p className="mt-4 text-green-600 font-medium italic">Your message has been sent. Thank you!</p>}
            {error && <p className="mt-4 text-red-600 font-medium">{error}</p>}
          </div>
        </div>
      </main>
    );
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ContactPage",
            "name": "Contact Pushpa Exports",
            "description": page?.meta_description || "Get in touch with Pushpa Exports for inquiries about our luxury handcrafted furniture from Udaipur, India.",
            "mainEntity": {
              "@type": "Organization",
              "name": "Pushpa Exports",
              "telephone": "+91-94141-62629",
              "email": "info@pushpaexports.com",
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
          alt="Pushpa Exports Studio"
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
                      <a href="mailto:info@pushpaexports.com" className="hover:text-[#B8860B] transition-colors underline underline-offset-4">info@pushpaarts.com</a><br />
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
                        {categories.filter(c => !c.parent_id).map(category => (
                          <option key={category.id} value={category.name}>{category.name}</option>
                        ))}
                        <option value="Custom Project">Bespoke Project</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3">
                    <label htmlFor="contact-document" className="text-[0.6rem] font-bold text-[#1F1F1F] uppercase tracking-[0.2em]">Upload Document (Max 10MB)</label>
                    <div className="relative">
                      <input
                        id="contact-document"
                        type="file"
                        className="bg-transparent border-b border-[#E5E0DA] py-3 text-[0.8rem] w-full focus:border-[#B8860B] outline-none transition-colors cursor-pointer file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-[#1F1F1F] file:text-white hover:file:bg-[#B8860B]"
                        onChange={e => {
                          const file = e.target.files[0];
                          if (file && file.size > 10 * 1024 * 1024) {
                            setError('File size exceeds 10MB limit.');
                            e.target.value = '';
                            setDocument(null);
                            return;
                          }
                          setError('');
                          setDocument(file);
                        }}
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      />
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
      <section className="pb-12 bg-[#F5F1EE]">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="reveal">
              <h2 className="font-heading text-[clamp(2.2rem,5vw,3.5rem)] text-[#1F1F1F] mb-8 italic">
                Our <span className="text-[#B8860B]">Udaipur Showroom</span>
              </h2>
              <p className="text-[#4A4A4A] mb-8 leading-[2.1] text-[1.1rem] font-light">
                Experience the tactile beauty of our masterpieces in person. Our flagship showroom in the heart of Udaipur showcases our latest collections in a curated architectural setting.
              </p>
              <div className="aspect-video bg-[#E5E0DA] relative rounded-[4px] overflow-hidden shadow-inner">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d50352.31699105845!2d73.65504458739277!3d24.60551920929089!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3967e453b1ceaa6b%3A0xac902e77b1ff6ea4!2sPushpa%20Exports!5e0!3m2!1sen!2sin!4v1776865803543!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="absolute inset-0"
                ></iframe>
              </div>
            </div>
            <div className="reveal delay-200">
              <div className="space-y-12">
                <div>
                  <h3 className="font-heading text-2xl text-[#1F1F1F] mb-4 italic">Frequently Asked <span className="text-[#B8860B]">Questions</span></h3>
                  <div className="space-y-6">
                    {faqs.map((faq, index) => (
                      <details key={faq.id || index} className="group border-b border-[#E5E0DA] pb-4 cursor-pointer">
                        <summary className="list-none flex items-center justify-between text-[0.95rem] font-medium text-[#1F1F1F]">
                          {faq.question}
                          <span className="group-open:rotate-180 transition-transform">↓</span>
                        </summary>
                        <p className="mt-4 text-[#8C8C8C] text-[0.9rem] font-light leading-relaxed">
                          {faq.answer}
                        </p>
                      </details>
                    ))}
                    {faqs.length === 0 && (
                      <p className="text-[#8C8C8C] italic text-sm">Our artisans are preparing answers to common inquiries.</p>
                    )}
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
