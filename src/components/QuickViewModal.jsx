'use client';
import { useState, useEffect } from 'react';
import { X, MessageSquare, Truck, ShieldCheck, ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';

export default function QuickViewModal({ product: initialProduct, onClose }) {
  const [product, setProduct] = useState(initialProduct);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  // Fetch full product details (including all images)
  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await fetch(`/api/products/${initialProduct.id}`);
        if (res.ok) {
          const data = await res.json();
          setProduct(data);
        }
      } catch (err) {
        console.error('QuickView fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [initialProduct.id]);

  if (!product) return null;

  const images = product.images && product.images.length > 0 
    ? product.images.map(img => img.file_path)
    : [product.primary_image || product.first_image || product.file_path || product.image || '/images/placeholder.jpg'];

  const handleNext = () => setCurrentIndex((prev) => (prev + 1) % images.length);
  const handlePrev = () => setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);

  return (
    <div className="fixed inset-0 z-[5000] flex items-center justify-center p-4 md:p-8">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative bg-white w-full max-w-[1100px] max-h-[90vh] overflow-y-auto rounded-sm shadow-2xl flex flex-col md:flex-row animate-in fade-in zoom-in duration-300">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 bg-white/80 backdrop-blur-sm hover:bg-white rounded-full transition-colors shadow-sm"
        >
          <X className="w-6 h-6 text-[var(--color-text-primary)]" />
        </button>

        {/* Left: Image Section */}
        <div className="w-full md:w-1/2 flex flex-col bg-[#F9F9F9]">
          <div className="relative aspect-square w-full group">
            {loading && <div className="absolute inset-0 flex items-center justify-center bg-gray-50 z-10">Loading...</div>}
            <Image
              src={images[currentIndex]}
              alt={product.name}
              fill
              className="object-contain p-8 md:p-12 transition-all duration-700"
            />
            
            {/* Nav Arrows */}
            {images.length > 1 && (
              <>
                <button onClick={handlePrev} className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 hover:bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-all">
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button onClick={handleNext} className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 hover:bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-all">
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}
          </div>
          
          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex justify-center gap-2 p-6 border-t border-black/5 bg-white">
              {images.map((img, i) => (
                <button 
                  key={i} 
                  onClick={() => setCurrentIndex(i)}
                  className={`relative w-16 h-16 border-2 transition-all overflow-hidden ${currentIndex === i ? 'border-[var(--color-accent)]' : 'border-transparent opacity-60 hover:opacity-100'}`}
                >
                  <Image src={img} alt={`${product.name} thumbnail ${i}`} fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Info Section */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
          <span className="text-[0.6rem] uppercase tracking-[0.3em] text-[var(--color-accent)] font-bold mb-4 block">
            {product.category_name || 'Artisan Series'}
          </span>
          <h2 className="text-3xl md:text-4xl font-heading text-[var(--color-text-primary)] mb-6 leading-tight">
            {product.name}
          </h2>
          
          <p className="text-[var(--color-text-secondary)] text-[0.95rem] leading-loose mb-10 font-light">
            {product.short_description || product.description || 'This exquisite masterpiece is handcrafted by our master artisans in Udaipur, featuring intricate designs and premium materials.'}
          </p>

          <div className="grid grid-cols-2 gap-6 mb-10">
            <div className="flex items-center gap-3">
              <Truck className="w-5 h-5 text-[var(--color-accent)]" />
              <span className="text-[0.65rem] uppercase tracking-[0.1em] font-bold">Global Shipping</span>
            </div>
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-[var(--color-accent)]" />
              <span className="text-[0.65rem] uppercase tracking-[0.1em] font-bold">Inlay Certified</span>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <a 
              href={`https://wa.me/919414162629?text=I'm interested in viewing more details for: ${product.name}`}
              className="w-full flex items-center justify-center gap-3 py-4 bg-[var(--color-secondary)] text-white text-[0.7rem] uppercase tracking-[0.2em] font-bold transition-all hover:bg-[var(--color-accent)] hover:shadow-lg"
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageSquare className="w-4 h-4" /> Inquiry on WhatsApp
            </a>
            <button 
              onClick={onClose}
              className="w-full py-4 border border-black/10 text-[var(--color-text-primary)] text-[0.7rem] uppercase tracking-[0.2em] font-bold transition-all hover:bg-black/5"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
