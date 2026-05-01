'use client';
import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';
import Image from 'next/image';
import { Trash2, Plus, Minus, ArrowLeft, ShoppingBag, Tag, X } from 'lucide-react';

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, cartTotal, appliedCoupon, discountAmount, finalTotal, applyCoupon, removeCoupon } = useCart();
  const [couponCode, setCouponCode] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponError('Please enter a coupon code.');
      return;
    }

    setCouponLoading(true);
    setCouponError('');
    setCouponSuccess('');

    try {
      const data = await applyCoupon(couponCode.trim());
      setCouponSuccess(data.message);
      setCouponCode('');
    } catch (err) {
      setCouponError(err.message);
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    removeCoupon();
    setCouponSuccess('');
    setCouponError('');
    setCouponCode('');
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-6">
        <div className="w-24 h-24 bg-[#F9F7F5] rounded-full flex items-center justify-center mb-8">
          <ShoppingBag className="w-10 h-10 text-black/10" />
        </div>
        <h1 className="text-3xl font-heading mb-4">Your collection is empty</h1>
        <p className="text-[var(--color-text-secondary)] mb-10 max-w-md text-center">
          It seems you haven't added any masterpieces to your collection yet.
        </p>
        <Link href="/product-category" className="bg-black text-white px-10 py-4 text-[0.65rem] uppercase tracking-[0.3em] font-bold hover:bg-[var(--color-accent)] transition-all">
          Browse Collections
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-40 pb-32 bg-white">
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <div>
            <p className="text-[var(--color-accent)] uppercase tracking-[0.5em] text-[0.6rem] font-bold mb-6">Gallery Registry</p>
            <h1 className="text-5xl font-heading text-[var(--color-text-primary)]">Your <span className="italic">Collection</span></h1>
          </div>
          <Link href="/product-category" className="flex items-center gap-3 text-[0.6rem] uppercase tracking-[0.3em] font-bold text-black/40 hover:text-black transition-colors group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Continue Exploring
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-16">
          {/* Cart Items */}
          <div className="space-y-10">
            <div className="hidden md:grid grid-cols-[1fr_120px_150px_120px] gap-8 pb-6 border-b border-black/5 text-[0.6rem] uppercase tracking-[0.3em] font-bold text-black/30">
              <div>Masterpiece</div>
              <div className="text-center">Price</div>
              <div className="text-center">Quantity</div>
              <div className="text-right">Total</div>
            </div>

            {cart.map((item) => (
              <div key={item.id} className="grid grid-cols-1 md:grid-cols-[1fr_120px_150px_120px] gap-8 items-center pb-10 border-b border-black/5 group">
                <div className="flex gap-6 items-center">
                  <div className="relative w-24 h-24 md:w-32 md:h-32 bg-[#F9F7F5] border border-black/5 rounded-sm overflow-hidden flex-shrink-0">
                    <Image
                      src={item.image || '/images/placeholder.jpg'}
                      alt={item.name}
                      fill
                      className="object-contain p-4"
                    />
                  </div>
                  <div>
                    <h3 className="text-[1rem] font-bold text-black mb-1 group-hover:text-[var(--color-accent)] transition-colors leading-tight">
                      {item.name}
                    </h3>
                    <p className="text-[0.65rem] text-black/40 uppercase tracking-widest font-medium">Udaipur Heritage</p>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="mt-4 text-[0.55rem] uppercase tracking-[0.2em] font-bold text-[#ff3b30] flex items-center gap-2 hover:opacity-70 transition-opacity"
                    >
                      <Trash2 className="w-3 h-3" /> Remove Item
                    </button>
                  </div>
                </div>

                <div className="hidden md:flex justify-center text-[1rem] font-medium text-black italic">
                  ₹{parseFloat(item.price || 0).toLocaleString()}
                </div>

                <div className="flex justify-center">
                  <div className="flex items-center border border-black/10 rounded-full px-4 py-2 bg-white shadow-sm">
                    <button
                      onClick={() => updateQuantity(item.id, -1)}
                      className="p-1 hover:text-[var(--color-accent)] transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="text-[0.9rem] font-bold w-12 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, 1)}
                      className="p-1 hover:text-[var(--color-accent)] transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="text-right text-[1.1rem] font-bold text-black">
                  ₹{(parseFloat(item.price || 0) * item.quantity).toLocaleString()}
                </div>
              </div>
            ))}
          </div>

          {/* Summary Sidebar */}
          <aside>
            <div className="bg-[#F9F7F5] p-10 border border-black/[0.03] sticky top-40">
              <h2 className="text-[0.7rem] uppercase tracking-[0.4em] font-bold mb-10 border-b border-black/5 pb-6">Summary</h2>

              {/* Coupon Section */}
              <div className="mb-10 pb-8 border-b border-black/5">
                <div className="flex items-center gap-2 mb-4">
                  <Tag className="w-4 h-4 text-[var(--color-accent)]" />
                  <span className="text-[0.65rem] uppercase tracking-[0.2em] font-bold text-black/40">Have a Coupon?</span>
                </div>

                {appliedCoupon ? (
                  <div className="bg-[var(--color-accent)]/5 border border-[var(--color-accent)]/15 rounded-lg px-4 py-3 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-[0.9rem] text-[var(--color-accent)]">{appliedCoupon.code}</span>
                        <span className="text-[0.6rem] uppercase tracking-wider font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">Applied</span>
                      </div>
                      <p className="text-[0.75rem] text-[var(--color-accent)]/70 mt-1">
                        {appliedCoupon.discount_type === 'percentage'
                          ? `${appliedCoupon.discount_value}% off`
                          : `₹${parseFloat(appliedCoupon.discount_value).toLocaleString()} off`}
                      </p>
                    </div>
                    <button
                      onClick={handleRemoveCoupon}
                      className="p-1.5 rounded-full hover:bg-black/10 transition-colors text-black/40 hover:text-[#ff3b30]"
                      title="Remove coupon"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={couponCode}
                        onChange={e => {
                          setCouponCode(e.target.value.toUpperCase());
                          setCouponError('');
                        }}
                        onKeyDown={e => e.key === 'Enter' && handleApplyCoupon()}
                        placeholder="Enter code"
                        className="flex-1 bg-white border border-black/10 px-4 py-3 rounded-lg text-[0.85rem] font-mono font-bold uppercase outline-none focus:border-[var(--color-accent)] transition-colors"
                      />
                      <button
                        onClick={handleApplyCoupon}
                        disabled={couponLoading}
                        className="px-5 py-3 bg-black text-white text-[0.7rem] uppercase tracking-[0.15em] font-bold rounded-lg hover:bg-[var(--color-accent)] transition-all disabled:opacity-50 flex items-center gap-2"
                      >
                        {couponLoading ? (
                          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                        ) : (
                          'Apply'
                        )}
                      </button>
                    </div>
                    {couponError && (
                      <p className="text-[#ff3b30] text-[0.75rem] mt-2 font-medium">{couponError}</p>
                    )}
                  </div>
                )}

                {couponSuccess && !couponError && (
                  <p className="text-green-600 text-[0.75rem] mt-2 font-medium">✓ {couponSuccess}</p>
                )}
              </div>

              <div className="space-y-6 mb-10">
                <div className="flex justify-between items-center text-[0.85rem]">
                  <span className="text-black/40 font-medium">Subtotal</span>
                  <span className="font-bold">₹{parseFloat(cartTotal || 0).toLocaleString()}</span>
                </div>

                {appliedCoupon && discountAmount > 0 && (
                  <div className="flex justify-between items-center text-[0.85rem]">
                    <span className="text-green-600 font-medium">Coupon Discount</span>
                    <span className="text-green-600 font-bold">- ₹{Math.round(discountAmount).toLocaleString()}</span>
                  </div>
                )}

                <div className="flex justify-between items-center text-[0.85rem]">
                  <span className="text-black/40 font-medium">SHIPPING</span>
                  <span className="text-[var(--color-accent)] font-bold uppercase tracking-wider text-[0.65rem]">FREE SHIPPING</span>
                </div>
                <div className="h-[1px] bg-black/5 my-4"></div>
                <div className="flex justify-between items-end">
                  <span className="text-[0.7rem] uppercase tracking-[0.3em] font-bold">Total Investment</span>
                  <div className="text-right">
                    {appliedCoupon && discountAmount > 0 && (
                      <span className="text-sm text-black/30 line-through block mb-1">₹{parseFloat(cartTotal || 0).toLocaleString()}</span>
                    )}
                    <span className="text-2xl font-heading italic">₹{parseFloat(finalTotal || 0).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <Link
                href="/checkout"
                className="w-full py-6 bg-black text-white text-[0.7rem] uppercase tracking-[0.4em] font-bold text-center block hover:bg-[var(--color-accent)] transition-all shadow-2xl shadow-black/10"
              >
                Proceed to Checkout
              </Link>

              <div className="mt-12 space-y-6 pt-10 border-t border-black/5">
                <div className="flex items-center gap-4 group">
                  <div className="w-10 h-10 rounded-full border border-black/10 flex items-center justify-center opacity-40 group-hover:opacity-100 transition-opacity">
                    <span className="text-sm">🛡️</span>
                  </div>
                  <p className="text-[0.6rem] uppercase tracking-[0.2em] font-bold leading-tight">Authenticity Guaranteed</p>
                </div>
                <div className="flex items-center gap-4 group">
                  <div className="w-10 h-10 rounded-full border border-black/10 flex items-center justify-center opacity-40 group-hover:opacity-100 transition-opacity">
                    <span className="text-sm">🌍</span>
                  </div>
                  <p className="text-[0.6rem] uppercase tracking-[0.2em] font-bold leading-tight">Worldwide Logistics</p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
