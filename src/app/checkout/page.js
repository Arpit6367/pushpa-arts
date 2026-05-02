'use client';
import { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, ShieldCheck, Truck, CreditCard, Tag, X, User, ChevronDown, CheckCircle2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function CheckoutPage() {
  const { cart, cartTotal, clearCart, appliedCoupon, discountAmount, finalTotal, applyCoupon, removeCoupon } = useCart();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');

  // Coupon state for checkout
  const [couponCode, setCouponCode] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');

  const [form, setForm] = useState({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    shipping_address: '',
    shipping_city: '',
    shipping_state: '',
    shipping_zip: '',
  });
  const [customer, setCustomer] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [showAddressList, setShowAddressList] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load saved info from localStorage and fetch customer profile
  useEffect(() => {
    const init = async () => {
      let customerData = null;

      // 1. Check for logged in customer
      try {
        const res = await fetch('/api/customer/me');
        if (res.ok) {
          customerData = await res.json();
          setCustomer(customerData);
          setAddresses(customerData.addresses || []);
        }
      } catch (err) {
        console.error('Failed to fetch customer info', err);
      }

      // 2. Load from localStorage
      let savedData = {};
      const savedInfo = localStorage.getItem('pushpa_checkout_info');
      if (savedInfo) {
        try {
          savedData = JSON.parse(savedInfo);
        } catch (err) {
          console.error('Failed to parse saved checkout info', err);
        }
      }

      // 3. Set form state - prioritize customerData if logged in
      if (customerData) {
        const defaultAddr = customerData.addresses?.find(a => a.is_default && a.address_type === 'shipping') || customerData.addresses?.[0];

        setForm({
          customer_name: `${customerData.first_name} ${customerData.last_name}`.trim(),
          customer_email: customerData.email,
          customer_phone: customerData.phone || savedData.customer_phone || '',
          shipping_address: defaultAddr?.address_line || savedData.shipping_address || '',
          shipping_city: defaultAddr?.city || savedData.shipping_city || '',
          shipping_state: defaultAddr?.state || savedData.shipping_state || '',
          shipping_zip: defaultAddr?.zip || savedData.shipping_zip || '',
        });
      } else if (Object.keys(savedData).length > 0) {
        setForm(prev => ({ ...prev, ...savedData }));
      }

      setIsLoaded(true);
    };

    init();
  }, []);

  const selectAddress = (addr) => {
    setForm(prev => ({
      ...prev,
      shipping_address: addr.address_line,
      shipping_city: addr.city,
      shipping_state: addr.state,
      shipping_zip: addr.zip
    }));
    setShowAddressList(false);
  };

  // Save info to localStorage on change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('pushpa_checkout_info', JSON.stringify(form));
    }
  }, [form, isLoaded]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          items: cart,
          total_amount: finalTotal,
          coupon_code: appliedCoupon?.code || null,
          discount_amount: discountAmount || 0,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setOrderNumber(data.order_number);
        setOrderComplete(true);
        clearCart();
        localStorage.removeItem('pushpa_checkout_info'); // Clear saved info on success
      } else {
        alert('Something went wrong. Please try again.');
      }
    } catch (err) {
      console.error(err);
      alert('Checkout failed.');
    } finally {
      setLoading(false);
    }
  };

  if (orderComplete) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white px-6">
        <div className="w-24 h-24 bg-[#34c759]/10 rounded-full flex items-center justify-center mb-10 animate-in zoom-in duration-700">
          <ShieldCheck className="w-12 h-12 text-[#34c759]" />
        </div>
        <p className="text-[var(--color-accent)] uppercase tracking-[0.5em] text-[0.6rem] font-bold mb-4">Registry Success</p>
        <h1 className="text-4xl font-heading mb-6 text-center italic">Your masterpiece is reserved.</h1>
        <p className="text-[var(--color-text-secondary)] mb-2 text-center">Order Number: <span className="text-black font-bold font-mono">{orderNumber}</span></p>
        <p className="text-[var(--color-text-secondary)] mb-12 max-w-md text-center leading-relaxed">
          Our artisans have been notified. You will receive a confirmation email shortly with the details of your heritage selection.
        </p>
        <Link href="/" className="bg-black text-white px-12 py-5 text-[0.7rem] uppercase tracking-[0.4em] font-bold hover:bg-[var(--color-accent)] transition-all shadow-xl">
          Return to Studio
        </Link>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6">
        <h1 className="text-3xl font-heading mb-6 italic">The cart is empty</h1>
        <Link href="/product-category" className="bg-black text-white px-10 py-4 text-[0.65rem] uppercase tracking-[0.3em] font-bold">
          Explore Masterpieces
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-32 bg-[#FBFBFD]">
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="flex items-center justify-between mb-12">
          <Link href="/cart" className="flex items-center gap-3 text-[0.6rem] uppercase tracking-[0.3em] font-bold text-black/40 hover:text-black transition-colors group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Collection
          </Link>
          <img src="/images/Pushpa-Exports.svg" alt="Logo" className="h-8 opacity-20" />
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-[1fr_450px] gap-16 items-start">
          {/* Shipping Form */}
          <div className="space-y-12">
            <section className="bg-white p-8 md:p-12 rounded-sm border border-black/5 shadow-sm">
              <h2 className="text-2xl font-heading mb-10 italic">Consignee Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex flex-col gap-2">
                  <label className="text-[0.65rem] uppercase tracking-[0.2em] font-bold text-black/40">Full Legal Name</label>
                  <input
                    type="text"
                    required
                    className="bg-[#f5f5f7] border-none px-5 py-4 rounded-sm text-[0.9rem] focus:bg-white focus:ring-1 focus:ring-[var(--color-accent)] transition-all outline-none"
                    value={form.customer_name}
                    onChange={e => setForm({ ...form, customer_name: e.target.value })}
                    placeholder="e.g. Julianne Moore"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[0.65rem] uppercase tracking-[0.2em] font-bold text-black/40">Email Address</label>
                  <input
                    type="email"
                    required
                    className="bg-[#f5f5f7] border-none px-5 py-4 rounded-sm text-[0.9rem] focus:bg-white focus:ring-1 focus:ring-[var(--color-accent)] transition-all outline-none"
                    value={form.customer_email}
                    onChange={e => setForm({ ...form, customer_email: e.target.value })}
                    placeholder="julianne@example.com"
                  />
                </div>
                <div className="flex flex-col gap-2 md:col-span-2">
                  <label className="text-[0.65rem] uppercase tracking-[0.2em] font-bold text-black/40">Direct Contact (Phone)</label>
                  <input
                    type="tel"
                    required
                    className="bg-[#f5f5f7] border-none px-5 py-4 rounded-sm text-[0.9rem] focus:bg-white focus:ring-1 focus:ring-[var(--color-accent)] transition-all outline-none"
                    value={form.customer_phone}
                    onChange={e => setForm({ ...form, customer_phone: e.target.value })}
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
              </div>
            </section>

            <section className="bg-white p-8 md:p-12 rounded-sm border border-black/5 shadow-sm">
              <div className="flex justify-between items-center mb-10">
                <h2 className="text-2xl font-heading italic">Destination Protocols</h2>
                {customer && addresses.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setShowAddressList(!showAddressList)}
                    className="text-[0.6rem] uppercase tracking-widest font-bold text-[var(--color-accent)] flex items-center gap-2 hover:opacity-70"
                  >
                    Switch Protocol <ChevronDown className={`w-3 h-3 transition-transform ${showAddressList ? 'rotate-180' : ''}`} />
                  </button>
                )}
              </div>

              {showAddressList && customer && (
                <div className="mb-10 grid grid-cols-1 md:grid-cols-2 gap-4 animate-in slide-in-from-top-4 duration-300">
                  {addresses.map(addr => (
                    <div
                      key={addr.id}
                      onClick={() => selectAddress(addr)}
                      className={`p-5 border rounded-lg cursor-pointer transition-all ${form.shipping_address === addr.address_line ? 'border-black bg-black/5' : 'border-black/5 hover:border-black/20'
                        }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-[0.55rem] uppercase tracking-widest font-bold text-black/40">{addr.address_type}</span>
                        {form.shipping_address === addr.address_line && <CheckCircle2 className="w-4 h-4 text-black" />}
                      </div>
                      <p className="text-[0.8rem] font-medium truncate">{addr.address_line}</p>
                      <p className="text-[0.7rem] text-black/60">{addr.city}, {addr.state}</p>
                    </div>
                  ))}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex flex-col gap-2 md:col-span-2">
                  <label className="text-[0.65rem] uppercase tracking-[0.2em] font-bold text-black/40">Street Address</label>
                  <input
                    type="text"
                    required
                    className="bg-[#f5f5f7] border-none px-5 py-4 rounded-sm text-[0.9rem] focus:bg-white focus:ring-1 focus:ring-[var(--color-accent)] transition-all outline-none"
                    value={form.shipping_address}
                    onChange={e => setForm({ ...form, shipping_address: e.target.value })}
                    placeholder="123 Heritage Lane"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[0.65rem] uppercase tracking-[0.2em] font-bold text-black/40">City</label>
                  <input
                    type="text"
                    required
                    className="bg-[#f5f5f7] border-none px-5 py-4 rounded-sm text-[0.9rem] focus:bg-white focus:ring-1 focus:ring-[var(--color-accent)] transition-all outline-none"
                    value={form.shipping_city}
                    onChange={e => setForm({ ...form, shipping_city: e.target.value })}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[0.65rem] uppercase tracking-[0.2em] font-bold text-black/40">State / Province</label>
                  <input
                    type="text"
                    required
                    className="bg-[#f5f5f7] border-none px-5 py-4 rounded-sm text-[0.9rem] focus:bg-white focus:ring-1 focus:ring-[var(--color-accent)] transition-all outline-none"
                    value={form.shipping_state}
                    onChange={e => setForm({ ...form, shipping_state: e.target.value })}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[0.65rem] uppercase tracking-[0.2em] font-bold text-black/40">ZIP / Postal Code</label>
                  <input
                    type="text"
                    required
                    className="bg-[#f5f5f7] border-none px-5 py-4 rounded-sm text-[0.9rem] focus:bg-white focus:ring-1 focus:ring-[var(--color-accent)] transition-all outline-none"
                    value={form.shipping_zip}
                    onChange={e => setForm({ ...form, shipping_zip: e.target.value })}
                  />
                </div>
              </div>
            </section>

            <div className="p-8 bg-[var(--color-accent)]/5 rounded-sm border border-[var(--color-accent)]/10 flex items-start gap-5">
              <Truck className="w-6 h-6 text-[var(--color-accent)] flex-shrink-0" />
              <div>
                <p className="text-[0.7rem] uppercase tracking-[0.2em] font-bold mb-1">Complimentary White-Glove Logistics</p>
                <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">Your selection will be handled by Udaipur's master logistics guild, ensuring safe passage across all international borders.</p>
              </div>
            </div>
          </div>

          {/* Sidebar: Order Summary */}
          <aside className="lg:sticky lg:top-32 space-y-8">
            <div className="bg-white p-10 border border-black/5 shadow-lg rounded-sm">
              <h3 className="text-[0.7rem] uppercase tracking-[0.4em] font-bold mb-10 border-b border-black/5 pb-6">Investment Summary</h3>

              <div className="space-y-8 mb-10 max-h-[400px] overflow-y-auto pr-4 no-scrollbar">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-5 items-center">
                    <div className="relative w-16 h-16 bg-[#F9F7F5] rounded-sm overflow-hidden flex-shrink-0 border border-black/5">
                      <Image src={item.image || '/images/placeholder.jpg'} alt={item.name} fill className="object-contain p-2" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-[0.7rem] font-bold text-black uppercase tracking-wider truncate">{item.name}</h4>
                      <p className="text-xs text-black/40">Qty: {item.quantity} × ₹{parseFloat(item.price || 0).toLocaleString()}</p>
                    </div>
                    <p className="text-[0.8rem] font-bold">₹{(parseFloat(item.price || 0) * item.quantity).toLocaleString()}</p>
                  </div>
                ))}
              </div>

              {/* Coupon Section */}
              <div className="mb-8 pb-6 border-t border-black/5 pt-6">
                <div className="flex items-center gap-2 mb-4">
                  <Tag className="w-4 h-4 text-[var(--color-accent)]" />
                  <span className="text-[0.6rem] uppercase tracking-[0.15em] font-bold text-black/40">Discount Code</span>
                </div>

                {appliedCoupon ? (
                  <div className="bg-[var(--color-accent)]/5 border border-[var(--color-accent)]/15 rounded-lg px-4 py-3 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-[0.85rem] text-[var(--color-accent)]">{appliedCoupon.code}</span>
                        <span className="text-[0.55rem] uppercase tracking-wider font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">Applied</span>
                      </div>
                      <p className="text-[0.7rem] text-[var(--color-accent)]/70 mt-0.5">
                        {appliedCoupon.discount_type === 'percentage'
                          ? `${appliedCoupon.discount_value}% off`
                          : `₹${parseFloat(appliedCoupon.discount_value).toLocaleString()} off`}
                      </p>
                    </div>
                    <button
                      onClick={handleRemoveCoupon}
                      className="p-1.5 rounded-full hover:bg-black/10 transition-colors text-black/40 hover:text-[#ff3b30]"
                      title="Remove coupon"
                      type="button"
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
                        onChange={e => { setCouponCode(e.target.value.toUpperCase()); setCouponError(''); }}
                        onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleApplyCoupon(); } }}
                        placeholder="Enter code"
                        className="flex-1 bg-[#f5f5f7] border border-black/5 px-4 py-3 rounded-lg text-[0.8rem] font-mono font-bold uppercase outline-none focus:border-[var(--color-accent)] transition-colors"
                      />
                      <button
                        onClick={handleApplyCoupon}
                        disabled={couponLoading}
                        type="button"
                        className="px-4 py-3 bg-black text-white text-[0.65rem] uppercase tracking-[0.1em] font-bold rounded-lg hover:bg-[var(--color-accent)] transition-all disabled:opacity-50"
                      >
                        {couponLoading ? '...' : 'Apply'}
                      </button>
                    </div>
                    {couponError && <p className="text-[#ff3b30] text-[0.7rem] mt-2 font-medium">{couponError}</p>}
                  </div>
                )}
                {couponSuccess && !couponError && (
                  <p className="text-green-600 text-[0.7rem] mt-2 font-medium">✓ {couponSuccess}</p>
                )}
              </div>

              <div className="space-y-4 mb-10 pt-4 border-t border-black/5">
                <div className="flex justify-between text-sm">
                  <span className="text-black/40">Catalog Total</span>
                  <span className="font-medium">₹{parseFloat(cartTotal || 0).toLocaleString()}</span>
                </div>

                {appliedCoupon && discountAmount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-green-600">Coupon Discount ({appliedCoupon.code})</span>
                    <span className="text-green-600 font-bold">- ₹{Math.round(discountAmount).toLocaleString()}</span>
                  </div>
                )}

                <div className="flex justify-between text-sm">
                  <span className="text-black/40">Curation & Logistics</span>
                  <span className="text-[var(--color-accent)] font-bold text-[0.6rem] uppercase tracking-widest">Complimentary</span>
                </div>
                <div className="h-[1px] bg-black/10 my-4"></div>
                <div className="flex justify-between items-end">
                  <span className="text-[0.7rem] uppercase tracking-[0.4em] font-bold">Total Investment</span>
                  <div className="text-right">
                    {appliedCoupon && discountAmount > 0 && (
                      <span className="text-sm text-black/30 line-through block mb-1">₹{parseFloat(cartTotal || 0).toLocaleString()}</span>
                    )}
                    <span className="text-2xl font-heading italic">₹{parseFloat(finalTotal || 0).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-6 bg-black text-white text-[0.7rem] uppercase tracking-[0.4em] font-bold hover:bg-[var(--color-accent)] transition-all flex items-center justify-center gap-4 disabled:opacity-50"
              >
                {loading ? 'Processing...' : 'Confirm Reservation'}
                <CreditCard className="w-4 h-4" />
              </button>

              <div className="mt-8 flex flex-col items-center gap-4 opacity-30">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-3 h-3" />
                  <span className="text-[0.5rem] uppercase tracking-[0.2em] font-bold">Secure Udaipur Studio Encrypted</span>
                </div>
              </div>
            </div>
          </aside>
        </form>
      </div>
    </div>
  );
}
