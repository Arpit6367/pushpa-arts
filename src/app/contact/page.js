'use client';
import { useState } from 'react';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
    setForm({ name: '', email: '', phone: '', subject: '', message: '' });
  };

  return (
    <>
      <div className="bg-[#F5F1EE] pt-32 pb-16 border-b border-[#E5E0DA]">
        <div className="max-w-[1600px] mx-auto px-[clamp(1.2rem,5vw,6rem)]">
          <h1 className="text-[clamp(2.5rem,5vw,4rem)] font-heading leading-tight text-[#1F1F1F]">
            Contact <span className="text-[#B8860B]">Us</span>
          </h1>
          <div className="w-16 h-[2px] bg-[#B8860B] my-8"></div>
          <div className="flex flex-wrap items-center gap-2 text-[0.8rem] tracking-[0.2em] uppercase text-[#1F1F1F]">
            <a href="/" className="opacity-60 hover:opacity-100 transition-opacity">Home</a> 
            <span className="opacity-30">/</span> 
            <span className="font-semibold">Contact</span>
          </div>
        </div>
      </div>

      <section className="py-[clamp(5rem,10vw,9rem)] bg-[#FCFAF8]">
        <div className="max-w-[1600px] mx-auto px-[clamp(1.2rem,5vw,6rem)]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-32">
            {/* Contact Info */}
            <div className="reveal">
              <h2 className="font-heading text-[clamp(1.8rem,4vw,2.5rem)] text-[#1F1F1F] mb-6">
                Get in <span className="text-[#B8860B]">Touch</span>
              </h2>
              <p className="text-[#4A4A4A] mb-12 leading-[1.8] text-[1.05rem] font-light">
                Have a question or interested in our products? We&apos;d love to hear from you. 
                Reach out to us through any of the channels below or fill out the inquiry form.
              </p>

              <div className="space-y-8">
                <div className="flex gap-6 items-start">
                  <div className="w-12 h-12 rounded-full bg-[#1F1F1F]/5 flex items-center justify-center text-xl shrink-0">📍</div>
                  <div>
                    <h4 className="font-semibold text-[#1F1F1F] mb-1">Visit Us</h4>
                    <p className="text-[#4A4A4A] font-light">Udaipur, Rajasthan, India</p>
                  </div>
                </div>

                <div className="flex gap-6 items-start">
                  <div className="w-12 h-12 rounded-full bg-[#1F1F1F]/5 flex items-center justify-center text-xl shrink-0">✉</div>
                  <div>
                    <h4 className="font-semibold text-[#1F1F1F] mb-1">Email Us</h4>
                    <p><a href="mailto:info@pushpaarts.com" className="text-[#B8860B] hover:text-[#D4AF37] transition-colors font-light">info@pushpaarts.com</a></p>
                  </div>
                </div>

                <div className="flex gap-6 items-start">
                  <div className="w-12 h-12 rounded-full bg-[#1F1F1F]/5 flex items-center justify-center text-xl shrink-0">📞</div>
                  <div>
                    <h4 className="font-semibold text-[#1F1F1F] mb-1">Call Us</h4>
                    <p className="text-[#4A4A4A] font-light">+91 94141 62629</p>
                  </div>
                </div>

                <div className="flex gap-6 items-start">
                  <div className="w-12 h-12 rounded-full bg-[#1F1F1F]/5 flex items-center justify-center text-xl shrink-0">💬</div>
                  <div>
                    <h4 className="font-semibold text-[#1F1F1F] mb-1">WhatsApp</h4>
                    <p>
                      <a 
                        href="https://wa.me/919414162629" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-[#B8860B] hover:text-[#D4AF37] transition-colors font-light"
                      >
                        Chat with us on WhatsApp
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="reveal">
              <div className="bg-white p-[clamp(1.5rem,5vw,3.5rem)] rounded-[20px] border border-[#E5E0DA] shadow-xl">
                <h3 className="font-heading text-2xl text-[#1F1F1F] mb-8">
                  Send an Inquiry
                </h3>

                {submitted && (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 mb-8 text-[0.9rem] animate-fade-in">
                    Thank you for your inquiry! We&apos;ll get back to you soon.
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="contact-name" className="text-[0.85rem] font-semibold text-[#1d1d1f]">Your Name</label>
                    <input
                      id="contact-name"
                      type="text"
                      className="bg-[#f5f5f7] border border-transparent px-5 py-3.5 rounded-xl text-base w-full transition-all focus:bg-white focus:border-[#0071e3] outline-none"
                      value={form.name}
                      onChange={e => setForm({...form, name: e.target.value})}
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="contact-email" className="text-[0.85rem] font-semibold text-[#1d1d1f]">Email Address</label>
                    <input
                      id="contact-email"
                      type="email"
                      className="bg-[#f5f5f7] border border-transparent px-5 py-3.5 rounded-xl text-base w-full transition-all focus:bg-white focus:border-[#0071e3] outline-none"
                      value={form.email}
                      onChange={e => setForm({...form, email: e.target.value})}
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="contact-phone" className="text-[0.85rem] font-semibold text-[#1d1d1f]">Phone Number</label>
                    <input
                      id="contact-phone"
                      type="tel"
                      className="bg-[#f5f5f7] border border-transparent px-5 py-3.5 rounded-xl text-base w-full transition-all focus:bg-white focus:border-[#0071e3] outline-none"
                      value={form.phone}
                      onChange={e => setForm({...form, phone: e.target.value})}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="contact-subject" className="text-[0.85rem] font-semibold text-[#1d1d1f]">Subject</label>
                    <input
                      id="contact-subject"
                      type="text"
                      className="bg-[#f5f5f7] border border-transparent px-5 py-3.5 rounded-xl text-base w-full transition-all focus:bg-white focus:border-[#0071e3] outline-none"
                      value={form.subject}
                      onChange={e => setForm({...form, subject: e.target.value})}
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="contact-message" className="text-[0.85rem] font-semibold text-[#1d1d1f]">Your Message</label>
                    <textarea
                      id="contact-message"
                      rows="4"
                      className="bg-[#f5f5f7] border border-transparent px-5 py-3.5 rounded-xl text-base w-full transition-all focus:bg-white focus:border-[#0071e3] outline-none resize-none"
                      value={form.message}
                      onChange={e => setForm({...form, message: e.target.value})}
                      required
                    />
                  </div>
                  <button type="submit" className="w-full bg-[#1F1F1F] text-white py-4 rounded-xl text-[0.85rem] font-bold uppercase tracking-[0.2em] hover:bg-[#B8860B] transition-all transform hover:-translate-y-1 shadow-lg cursor-pointer">
                    Send Message
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

