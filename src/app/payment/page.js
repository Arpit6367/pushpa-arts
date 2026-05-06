'use client';
import React, { useState, useEffect, Suspense } from 'react';
import { useCart } from '@/context/CartContext';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ShieldCheck, Lock, ArrowLeft, CreditCard, CheckCircle2 } from 'lucide-react';

const PAYMENT_METHODS = [
  {
    id: 'paypal',
    label: 'PayPal',
    description: 'Pay via PayPal.',
    icon: null,
    logos: ['/images/payment/paypal.svg'],
  },
  {
    id: 'credit_debit_card',
    label: 'Credit/Debit Cards',
    description: 'Pay securely with your credit or debit card.',
    icon: null,
    logos: [
      '/images/payment/visa.svg',
      '/images/payment/mastercard.svg',
      '/images/payment/amex.svg',
      '/images/payment/discover.svg',
      '/images/payment/maestro.svg',
      '/images/payment/dinersclub.svg',
    ],
  },
  {
    id: 'google_pay',
    label: 'Google Pay',
    description: 'Pay with Google Pay for a fast checkout.',
    icon: null,
    logos: ['/images/payment/gpay.svg'],
  },
  {
    id: 'card',
    label: 'Debit & Credit Cards',
    description: 'Enter your card details below.',
    icon: null,
    logos: [],
  },
];

function PaymentPageContent() {
  const { cart, cartTotal, finalTotal, discountAmount, appliedCoupon, clearCart } = useCart();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [selectedMethod, setSelectedMethod] = useState('paypal');
  const [loading, setLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [txnId, setTxnId] = useState('');
  const [orderNumber, setOrderNumber] = useState('');
  const [orderId, setOrderId] = useState(null);
  const [error, setError] = useState('');

  // Card form state
  const [cardForm, setCardForm] = useState({
    card_name: '',
    card_number: '',
    card_expiry: '',
    card_cvc: '',
  });

  useEffect(() => {
    const oid = searchParams.get('order_id');
    const onum = searchParams.get('order_number');
    if (oid) setOrderId(oid);
    if (onum) setOrderNumber(onum);
  }, [searchParams]);

  const formatCardNumber = (value) => {
    const v = value.replace(/\D/g, '').slice(0, 16);
    return v.replace(/(\d{4})(?=\d)/g, '$1 ');
  };

  const formatExpiry = (value) => {
    const v = value.replace(/\D/g, '').slice(0, 4);
    if (v.length >= 3) return v.slice(0, 2) + '/' + v.slice(2);
    return v;
  };

  const [showGateway, setShowGateway] = useState(false);
  const [gatewayStep, setGatewayStep] = useState(0); // 0: connecting, 1: authenticating, 2: authorizing

  const handlePayment = async (e) => {
    e.preventDefault();
    setError('');

    // 1. Client-side Validation
    if (needsCardForm) {
      if (!cardForm.card_name || !cardForm.card_number || !cardForm.card_expiry || !cardForm.card_cvc) {
        setError('Please fill in all card details.');
        return;
      }
      if (cardForm.card_number.replace(/\s/g, '').length < 16) {
        setError('Invalid card number.');
        return;
      }
    }

    // 2. Start Gateway Simulation
    setShowGateway(true);
    setGatewayStep(0);
    setLoading(true);

    // Simulate Gateway Steps
    const steps = ['Connecting to secure gateway...', 'Authenticating payment...', 'Authorizing transaction...'];

    for (let i = 0; i < steps.length; i++) {
      setGatewayStep(i);
      await new Promise(r => setTimeout(r, 1200));
    }

    try {
      const payload = {
        order_id: orderId,
        payment_method: selectedMethod,
        payer_email: null,
        amount_paid: finalTotal,
        // Include masked card info for simulation
        ...(needsCardForm && {
          card_name: cardForm.card_name,
          card_number: cardForm.card_number,
          card_expiry: cardForm.card_expiry,
          card_cvc: cardForm.card_cvc
        })
      };

      const res = await fetch('/api/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        // Success! Hide gateway and show success screen
        setTxnId(data.transaction_id);
        setOrderNumber(data.order_number);
        setTimeout(() => {
          setPaymentSuccess(true);
          setShowGateway(false);
          clearCart();
          localStorage.removeItem('pushpa_checkout_info');
        }, 800);
      } else {
        setError(data.error || 'Transaction declined by issuer.');
        setShowGateway(false);
      }
    } catch (err) {
      console.error('Payment error:', err);
      setError('Connection timeout. Please check your network.');
      setShowGateway(false);
    } finally {
      setLoading(false);
    }
  };


  // Success screen
  if (paymentSuccess) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white px-6">
        <div className="w-24 h-24 bg-[#34c759]/10 rounded-full flex items-center justify-center mb-10" style={{ animation: 'fadeInUp 0.7s ease-out both' }}>
          <CheckCircle2 className="w-12 h-12 text-[#34c759]" />
        </div>
        <p className="text-[var(--color-accent)] uppercase tracking-[0.5em] text-[0.6rem] font-bold mb-4">Payment Successful</p>
        <h1 className="text-4xl font-heading mb-6 text-center italic">Thank you for your purchase!</h1>
        <p className="text-[var(--color-text-secondary)] mb-2 text-center">
          Order Number: <span className="text-black font-bold font-mono">{orderNumber}</span>
        </p>
        <p className="text-[var(--color-text-secondary)] mb-2 text-center">
          Transaction ID: <span className="text-black font-bold font-mono text-sm">{txnId}</span>
        </p>
        <p className="text-[var(--color-text-secondary)] mb-12 max-w-md text-center leading-relaxed">
          Your payment has been processed successfully. You will receive a confirmation email shortly with the details of your order.
        </p>
        <Link href="/" className="bg-black text-white px-12 py-5 text-[0.7rem] uppercase tracking-[0.4em] font-bold hover:bg-[var(--color-accent)] transition-all shadow-xl">
          Return to Studio
        </Link>
      </div>
    );
  }

  // No order_id - redirect back
  if (!orderId) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6">
        <Lock className="w-12 h-12 text-black/10 mb-6" />
        <h1 className="text-3xl font-heading mb-4 italic">No order to pay for</h1>
        <p className="text-[var(--color-text-secondary)] mb-8 text-center max-w-md">Please complete the checkout process first.</p>
        <Link href="/checkout" className="bg-black text-white px-10 py-4 text-[0.65rem] uppercase tracking-[0.3em] font-bold hover:bg-[var(--color-accent)] transition-all">
          Go to Checkout
        </Link>
      </div>
    );
  }

  const needsCardForm = selectedMethod === 'credit_debit_card' || selectedMethod === 'card';

  return (
    <div className="pt-16 pb-16 bg-[#FBFBFD] min-h-screen">
      <div className="max-w-[960px] mx-auto px-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <Link href="/checkout" className="flex items-center gap-3 text-[0.6rem] uppercase tracking-[0.3em] font-bold text-black/40 hover:text-black transition-colors group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Checkout
          </Link>
          <img src="/images/Pushpa-Exports.svg" alt="Logo" className="h-8 opacity-20" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-12 items-start">
          {/* Payment Methods */}
          <form onSubmit={handlePayment}>
            <div className="bg-white rounded-lg border border-black/5 shadow-sm overflow-hidden">
              <div className="p-8 pb-4">
                <h1 className="text-2xl font-heading mb-2">Payment Information</h1>
                <p className="text-[var(--color-accent)] text-sm font-medium">All transactions are secured and encrypted</p>
              </div>

              {PAYMENT_METHODS.map((method) => (
                <div key={method.id} className="border-b border-black/5 last:border-0">
                  <label
                    htmlFor={`pay-${method.id}`}
                    className={`flex items-center justify-between px-8 py-6 cursor-pointer transition-all ${selectedMethod === method.id ? 'bg-[#f8f6f4]' : 'hover:bg-[#fafafa]'}`}
                  >
                    <div className="flex items-center gap-5">
                      <div className="relative w-6 h-6">
                        <input
                          type="radio"
                          id={`pay-${method.id}`}
                          name="payment_method"
                          value={method.id}
                          checked={selectedMethod === method.id}
                          onChange={(e) => {
                            e.stopPropagation();
                            setSelectedMethod(method.id);
                            setError('');
                          }}
                          className="sr-only"
                        />
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${selectedMethod === method.id ? 'border-[#e68a00] bg-[#e68a00]' : 'border-black/10'}`}>
                          {selectedMethod === method.id && (
                            <div className="w-2.5 h-2.5 rounded-full bg-white" />
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[1rem] font-bold text-[#1d1d1f]">{method.label}</span>
                        <span className="text-[0.7rem] text-black/40 uppercase tracking-widest font-medium">Verified Gateway</span>
                      </div>
                    </div>

                    {method.logos.length > 0 && (
                      <div className="flex items-center gap-3">
                        {method.logos.map((logo, i) => (
                          <img key={i} src={logo} alt="" className="h-4 w-auto grayscale opacity-40" />
                        ))}
                      </div>
                    )}
                  </label>

                  {/* Method Details */}
                  {selectedMethod === method.id && (
                    <div className="px-8 pb-8 pt-2 animate-in slide-in-from-top-2 duration-300">
                      {/* Card Form */}
                      {needsCardForm && (
                        <div className="space-y-5 bg-white p-6 rounded-xl border border-black/5 shadow-sm">
                          <div className="flex flex-col gap-2">
                            <label className="text-[0.65rem] uppercase tracking-widest font-bold text-black/40">Cardholder Name</label>
                            <input
                              type="text"
                              required
                              value={cardForm.card_name}
                              onChange={e => setCardForm({ ...cardForm, card_name: e.target.value.toUpperCase() })}
                              placeholder="AS PRINTED ON CARD"
                              className="bg-[#fbfbfd] border border-black/5 px-5 py-4 rounded-lg text-[0.9rem] focus:bg-white focus:border-[#e68a00]/30 transition-all outline-none"
                            />
                          </div>
                          <div className="flex flex-col gap-2">
                            <label className="text-[0.65rem] uppercase tracking-widest font-bold text-black/40">Card Number</label>
                            <div className="relative">
                              <input
                                type="text"
                                required
                                value={cardForm.card_number}
                                onChange={e => setCardForm({ ...cardForm, card_number: formatCardNumber(e.target.value) })}
                                placeholder="0000 0000 0000 0000"
                                maxLength={19}
                                className="bg-[#fbfbfd] border border-black/5 px-5 py-4 rounded-lg text-[0.9rem] font-mono focus:bg-white focus:border-[#e68a00]/30 transition-all outline-none w-full pr-12"
                              />
                              <CreditCard className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-black/10" />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-5">
                            <div className="flex flex-col gap-2">
                              <label className="text-[0.65rem] uppercase tracking-widest font-bold text-black/40">Expiry Date</label>
                              <input
                                type="text"
                                required
                                value={cardForm.card_expiry}
                                onChange={e => setCardForm({ ...cardForm, card_expiry: formatExpiry(e.target.value) })}
                                placeholder="MM/YY"
                                maxLength={5}
                                className="bg-[#fbfbfd] border border-black/5 px-5 py-4 rounded-lg text-[0.9rem] focus:bg-white focus:border-[#e68a00]/30 transition-all outline-none"
                              />
                            </div>
                            <div className="flex flex-col gap-2">
                              <label className="text-[0.65rem] uppercase tracking-widest font-bold text-black/40">CVC</label>
                              <input
                                type="password"
                                required
                                value={cardForm.card_cvc}
                                onChange={e => setCardForm({ ...cardForm, card_cvc: e.target.value.replace(/\D/g, '').slice(0, 4) })}
                                placeholder="•••"
                                maxLength={4}
                                className="bg-[#fbfbfd] border border-black/5 px-5 py-4 rounded-lg text-[0.9rem] focus:bg-white focus:border-[#e68a00]/30 transition-all outline-none"
                              />
                            </div>
                          </div>
                          <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-5 bg-black text-white text-[0.7rem] uppercase tracking-[0.4em] font-bold hover:bg-[#e68a00] transition-all rounded-lg shadow-xl disabled:opacity-50 mt-4"
                          >
                            {loading ? 'Authorizing...' : 'Authorize Secure Payment'}
                          </button>
                        </div>
                      )}

                      {/* PayPal Button */}
                      {selectedMethod === 'paypal' && (
                        <div className="p-6 bg-[#f8f9fc] border border-[#003087]/10 rounded-xl text-center">
                          <div className="mb-6">
                            <span className="text-3xl italic font-black tracking-tight text-[#003087]" style={{ fontFamily: 'Verdana, sans-serif' }}>
                              PayPal
                            </span>
                          </div>
                          <p className="text-sm text-black/40 mb-8 px-4 leading-relaxed">Proceeding will open a secure window to authorize payment through your PayPal account.</p>
                          <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-[#FFC439] text-[#111] rounded-full font-bold hover:bg-[#F2BA36] transition-all flex items-center justify-center gap-3 shadow-md"
                          >
                            {loading ? <div className="w-5 h-5 border-2 border-black/20 border-t-black animate-spin rounded-full" /> : <><span className="italic font-black text-lg">PayPal</span> Checkout</>}
                          </button>
                        </div>
                      )}

                      {/* Google Pay Button */}
                      {selectedMethod === 'google_pay' && (
                        <div className="p-6 bg-black text-white rounded-xl text-center">
                          <div className="mb-6 flex justify-center items-center gap-2">
                            <img src="https://www.gstatic.com/images/branding/googlelogo/2x/googlelogo_light_color_92x30dp.png" className="h-6" alt="Google" />
                            <span className="text-xl font-medium">Pay</span>
                          </div>
                          <p className="text-sm opacity-60 mb-8">Click to authorize this transaction securely via Google Pay API.</p>
                          <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-white text-black rounded-lg font-bold hover:bg-gray-100 transition-all flex items-center justify-center gap-3"
                          >
                            {loading ? <div className="w-5 h-5 border-2 border-black/20 border-t-black animate-spin rounded-full" /> : <><img src="https://www.gstatic.com/images/branding/googlelogo/2x/googlelogo_color_92x30dp.png" className="h-4" alt="Google" /> Buy Now</>}
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Error Message */}
            {error && (
              <div className="mt-6 p-4 bg-red-50 border border-red-100 rounded-lg flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
                <ShieldAlert className="w-5 h-5 text-red-500" />
                <p className="text-sm text-red-600 font-medium">{error}</p>
              </div>
            )}

            {/* Security Indicators */}
            <div className="mt-12 flex flex-col items-center gap-8">
              <div className="flex items-center gap-8 opacity-60 grayscale hover:grayscale-0 transition-all duration-700">
                <img src="/images/payment/mcafee.svg" alt="McAfee Secure" className="h-10 w-auto" />
                <img src="/images/payment/norton.svg" alt="Norton Secured" className="h-10 w-auto" />
              </div>
              <div className="flex items-center gap-4 opacity-30">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4" />
                  <span className="text-[0.6rem] uppercase tracking-[0.2em] font-bold">Encrypted Connection</span>
                </div>
                <div className="w-1 h-1 rounded-full bg-black" />
                <div className="flex items-center gap-2">
                  <Lock className="w-3 h-3" />
                  <span className="text-[0.6rem] uppercase tracking-[0.2em] font-bold">PCI Compliant</span>
                </div>
              </div>
            </div>
          </form>


          {/* Order Summary Sidebar */}
          <aside className="lg:sticky lg:top-32">
            <div className="bg-white p-8 border border-black/5 shadow-sm rounded-lg">
              <h3 className="text-[0.7rem] uppercase tracking-[0.4em] font-bold mb-8 border-b border-black/5 pb-5">Order Summary</h3>

              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-sm">
                  <span className="text-black/40">Subtotal</span>
                  <span className="font-medium">₹{parseFloat(cartTotal || 0).toLocaleString()}</span>
                </div>

                {appliedCoupon && discountAmount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-green-600">Discount ({appliedCoupon.code})</span>
                    <span className="text-green-600 font-bold">- ₹{Math.round(discountAmount).toLocaleString()}</span>
                  </div>
                )}

                <div className="flex justify-between text-sm">
                  <span className="text-black/40">Shipping</span>
                  <span className="text-[var(--color-accent)] font-bold text-[0.6rem] uppercase tracking-widest">Free</span>
                </div>

                <div className="h-[1px] bg-black/10 my-3" />

                <div className="flex justify-between items-end">
                  <span className="text-[0.7rem] uppercase tracking-[0.3em] font-bold">Total</span>
                  <span className="text-2xl font-heading italic">₹{parseFloat(finalTotal || 0).toLocaleString()}</span>
                </div>
              </div>

              <div className="text-[0.65rem] text-black/30 text-center leading-relaxed">
                Order #{orderNumber}
              </div>
            </div>
          </aside>
        </div>
      </div>
      {showGateway && <GatewayModal step={gatewayStep} method={selectedMethod} />}
    </div>
  );
}

export default function PaymentPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner" />
      </div>
    }>
      <PaymentPageContent />
    </Suspense>
  );
}

function GatewayModal({ step, method }) {
  const steps = ['Connecting to secure gateway...', 'Authenticating payment...', 'Authorizing transaction...'];
  const progress = ((step + 1) / steps.length) * 100;

  return (
    <div className="fixed inset-0 z-[3000] flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-white/80 backdrop-blur-xl" />
      <div className="relative bg-white w-full max-w-md p-12 text-center shadow-2xl rounded-3xl border border-black/5 animate-in zoom-in duration-300">
        {/* Gateway Brand Simulation */}
        <div className="mb-10 flex flex-col items-center">
          <div className="h-10 w-auto mb-6 opacity-40">
            {method === 'paypal' ? (
              <span className="text-2xl italic font-black tracking-tight text-[#003087]">PayPal</span>
            ) : method === 'google_pay' ? (
              <span className="text-2xl font-medium text-[#5f6368]">Google Pay</span>
            ) : (
              <div className="flex gap-2">
                <ShieldCheck className="w-8 h-8 text-[var(--color-accent)]" />
                <span className="text-2xl font-heading italic">SecurePay</span>
              </div>
            )}
          </div>
          <div className="w-16 h-16 rounded-full border-4 border-black/5 border-t-[var(--color-accent)] animate-spin mb-8" />
        </div>

        <h3 className="text-xl font-heading mb-3 italic">{steps[step]}</h3>
        <p className="text-[var(--color-text-secondary)] text-sm mb-8 leading-relaxed">
          Please do not refresh the page or close your browser. You are in a secure payment environment.
        </p>

        {/* Progress Bar */}
        <div className="w-full h-1 bg-black/5 rounded-full overflow-hidden mb-10">
          <div
            className="h-full bg-[var(--color-accent)] transition-all duration-1000 ease-in-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex items-center justify-center gap-3 opacity-30">
          <Lock className="w-3 h-3" />
          <span className="text-[0.55rem] uppercase tracking-widest font-bold">Encrypted End-to-End</span>
        </div>
      </div>
    </div>
  );
}
