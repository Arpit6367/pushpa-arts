'use client';
import { useCart } from '@/context/CartContext';
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect } from 'react';

export default function MiniCart() {
  const { cart, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, cartTotal, cartCount, appliedCoupon, discountAmount, finalTotal } = useCart();

  // Close on Escape
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') setIsCartOpen(false);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [setIsCartOpen]);

  // Lock scroll when open
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isCartOpen]);

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-[6000] flex justify-end">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={() => setIsCartOpen(false)}
      />

      {/* Drawer */}
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-500 ease-out">
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-black/5">
          <div className="flex items-center gap-3">
            <ShoppingBag className="w-5 h-5 text-[var(--color-accent)]" />
            <h2 className="text-[0.7rem] uppercase tracking-[0.4em] font-bold">Your Collection ({cartCount})</h2>
          </div>
          <button 
            onClick={() => setIsCartOpen(false)}
            className="p-2 hover:bg-black/5 rounded-full transition-colors"
            suppressHydrationWarning
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto px-8 py-6 space-y-8 no-scrollbar">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <div className="w-20 h-20 bg-[#F9F7F5] rounded-full flex items-center justify-center mb-6">
                <ShoppingBag className="w-8 h-8 text-black/10" />
              </div>
              <p className="text-[0.7rem] uppercase tracking-[0.3em] font-bold text-black/40 mb-6">The gallery is empty</p>
              <button 
                onClick={() => setIsCartOpen(false)}
                className="text-[0.6rem] uppercase tracking-[0.4em] font-bold border-b border-black pb-1 hover:text-[var(--color-accent)] hover:border-[var(--color-accent)] transition-all"
              >
                Browse Creations
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="flex gap-6 group">
                <div className="relative w-24 h-24 bg-[#F9F7F5] rounded-sm overflow-hidden border border-black/5 flex-shrink-0">
                  <Image 
                    src={item.image || '/images/placeholder.jpg'} 
                    alt={item.name}
                    fill
                    className="object-contain p-2"
                  />
                </div>
                <div className="flex-1 flex flex-col justify-between py-1">
                  <div>
                    <div className="flex justify-between items-start gap-4">
                      <h3 className="text-[0.75rem] font-bold uppercase tracking-wider line-clamp-2 leading-relaxed">
                        {item.name}
                      </h3>
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="text-black/20 hover:text-[#ff3b30] transition-colors"
                        suppressHydrationWarning
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-[0.9rem] font-medium text-[var(--color-accent)] mt-1 italic">
                      ₹{parseFloat(item.price).toLocaleString()}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="flex items-center border border-black/10 rounded-full px-3 py-1">
                      <button 
                        onClick={() => updateQuantity(item.id, -1)}
                        className="p-1 hover:text-[var(--color-accent)]"
                        suppressHydrationWarning
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-bold w-8 text-center">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, 1)}
                        className="p-1 hover:text-[var(--color-accent)]"
                        suppressHydrationWarning
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="px-8 py-10 bg-[#F9F7F5] border-t border-black/5 space-y-6">
            <div className="flex justify-between items-end">
              <div>
                <p className="text-[0.55rem] uppercase tracking-[0.3em] font-bold text-black/40 mb-1">Estimated Total</p>
                {appliedCoupon && discountAmount > 0 ? (
                  <>
                    <p className="text-sm text-black/30 line-through">₹{parseFloat(cartTotal || 0).toLocaleString()}</p>
                    <p className="text-2xl font-heading italic text-black">₹{parseFloat(finalTotal || 0).toLocaleString()}</p>
                    <p className="text-[0.6rem] text-green-600 font-medium mt-1">🎫 {appliedCoupon.code} applied</p>
                  </>
                ) : (
                  <p className="text-2xl font-heading italic text-black">₹{parseFloat(cartTotal || 0).toLocaleString()}</p>
                )}
              </div>
              <p className="text-[0.6rem] text-black/30 font-medium">Incl. all taxes</p>
            </div>
            
            <div className="flex flex-col gap-3">
              <Link 
                href="/cart" 
                onClick={() => setIsCartOpen(false)}
                className="w-full py-4 bg-white border border-black/10 text-[0.65rem] uppercase tracking-[0.4em] font-bold text-center hover:bg-black hover:text-white transition-all shadow-sm"
                suppressHydrationWarning
              >
                View Collection
              </Link>
              <Link 
                href="/checkout" 
                onClick={() => setIsCartOpen(false)}
                className="w-full py-5 bg-black text-white text-[0.65rem] uppercase tracking-[0.4em] font-bold text-center flex items-center justify-center gap-4 hover:bg-[var(--color-accent)] transition-all shadow-xl group"
                suppressHydrationWarning
              >
                Secure Checkout 
                <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
              </Link>
            </div>
            
            <div className="flex items-center justify-center gap-3 opacity-20">
              <div className="h-[1px] flex-1 bg-black"></div>
              <p className="text-[0.5rem] uppercase tracking-[0.2em] font-bold">White Glove Delivery</p>
              <div className="h-[1px] flex-1 bg-black"></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
