'use client';
import { useState, useEffect } from 'react';

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const emptyForm = {
    code: '',
    description: '',
    discount_type: 'percentage',
    discount_value: '',
    min_order_amount: '',
    max_discount_amount: '',
    usage_limit: '',
    expires_at: '',
    is_active: true,
  };

  const [form, setForm] = useState(emptyForm);

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/coupons');
      const data = await res.json();
      if (res.ok) setCoupons(data.coupons);
    } catch (err) {
      console.error('Error fetching coupons:', err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const openCreateForm = () => {
    setForm(emptyForm);
    setEditingCoupon(null);
    setShowForm(true);
    setError('');
    setSuccess('');
  };

  const openEditForm = (coupon) => {
    setForm({
      code: coupon.code,
      description: coupon.description || '',
      discount_type: coupon.discount_type,
      discount_value: coupon.discount_value,
      min_order_amount: coupon.min_order_amount || '',
      max_discount_amount: coupon.max_discount_amount || '',
      usage_limit: coupon.usage_limit || '',
      expires_at: coupon.expires_at ? new Date(coupon.expires_at).toISOString().slice(0, 16) : '',
      is_active: coupon.is_active === 1 || coupon.is_active === true,
    });
    setEditingCoupon(coupon);
    setShowForm(true);
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const url = editingCoupon ? `/api/coupons/${editingCoupon.id}` : '/api/coupons';
      const method = editingCoupon ? 'PATCH' : 'POST';

      const payload = {
        ...form,
        discount_value: parseFloat(form.discount_value),
        min_order_amount: form.min_order_amount ? parseFloat(form.min_order_amount) : null,
        max_discount_amount: form.max_discount_amount ? parseFloat(form.max_discount_amount) : null,
        usage_limit: form.usage_limit ? parseInt(form.usage_limit) : null,
        expires_at: form.expires_at || null,
      };

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Something went wrong.');
        return;
      }

      setSuccess(editingCoupon ? 'Coupon updated successfully!' : 'Coupon created successfully!');
      setShowForm(false);
      fetchCoupons();
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this coupon?')) return;

    try {
      const res = await fetch(`/api/coupons/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setCoupons(prev => prev.filter(c => c.id !== id));
        setSuccess('Coupon deleted.');
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err) {
      console.error('Error deleting coupon:', err);
    }
  };

  const handleToggleActive = async (coupon) => {
    try {
      const res = await fetch(`/api/coupons/${coupon.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...coupon, is_active: !coupon.is_active }),
      });
      if (res.ok) {
        setCoupons(prev => prev.map(c => c.id === coupon.id ? { ...c, is_active: !c.is_active } : c));
      }
    } catch (err) {
      console.error('Error toggling coupon:', err);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  const isExpired = (dateStr) => {
    if (!dateStr) return false;
    return new Date(dateStr) < new Date();
  };

  return (
    <>
      {/* Header */}
      <div className="px-4 sm:px-8 lg:px-12 py-6 lg:py-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sticky top-0 z-50 bg-[#fbfbfd]/90 backdrop-blur-md">
        <div>
          <p className="text-[0.85rem] text-[#86868b] mb-2 font-medium">Promotions</p>
          <h1 className="text-[#0071e3] text-2xl sm:text-3xl font-bold tracking-tight">Coupons</h1>
        </div>
        <button
          onClick={openCreateForm}
          className="bg-[#0071e3] text-white px-6 py-3 rounded-xl text-[0.85rem] font-semibold hover:bg-[#0071e3]/90 transition-colors flex items-center gap-2"
        >
          <span className="text-lg">+</span> Create Coupon
        </button>
      </div>

      <div className="px-4 sm:px-8 lg:px-12 pb-12 lg:pb-20">
        {/* Status Messages */}
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 text-[0.85rem] font-medium animate-fade-in">
            ✅ {success}
          </div>
        )}
        {error && !showForm && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-[0.85rem] font-medium">
            {error}
          </div>
        )}

        {/* Create / Edit Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-[640px] max-h-[90vh] overflow-y-auto">
              <div className="px-8 py-6 border-b border-black/5 flex items-center justify-between">
                <h2 className="text-xl font-bold text-[#1d1d1f]">
                  {editingCoupon ? 'Edit Coupon' : 'Create New Coupon'}
                </h2>
                <button onClick={() => setShowForm(false)} className="text-2xl text-[#86868b] hover:text-[#1d1d1f] transition-colors">×</button>
              </div>

              <form onSubmit={handleSubmit} className="px-8 py-8 space-y-6">
                {error && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-[0.85rem]">
                    {error}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-[0.7rem] font-bold uppercase tracking-[0.15em] text-[#86868b]">Coupon Code *</label>
                    <input
                      type="text"
                      required
                      value={form.code}
                      onChange={e => setForm({ ...form, code: e.target.value.toUpperCase() })}
                      placeholder="e.g. SUMMER25"
                      className="bg-[#f5f5f7] border border-black/5 rounded-xl px-4 py-3 text-[0.9rem] font-mono font-bold uppercase outline-none focus:border-[#0071e3] transition-colors"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[0.7rem] font-bold uppercase tracking-[0.15em] text-[#86868b]">Discount Type *</label>
                    <select
                      value={form.discount_type}
                      onChange={e => setForm({ ...form, discount_type: e.target.value })}
                      className="bg-[#f5f5f7] border border-black/5 rounded-xl px-4 py-3 text-[0.9rem] outline-none focus:border-[#0071e3] transition-colors cursor-pointer"
                    >
                      <option value="percentage">Percentage (%)</option>
                      <option value="fixed">Fixed Amount (₹)</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[0.7rem] font-bold uppercase tracking-[0.15em] text-[#86868b]">Description</label>
                  <input
                    type="text"
                    value={form.description}
                    onChange={e => setForm({ ...form, description: e.target.value })}
                    placeholder="e.g. Summer sale - 25% off on all products"
                    className="bg-[#f5f5f7] border border-black/5 rounded-xl px-4 py-3 text-[0.9rem] outline-none focus:border-[#0071e3] transition-colors"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-[0.7rem] font-bold uppercase tracking-[0.15em] text-[#86868b]">
                      Discount Value * {form.discount_type === 'percentage' ? '(%)' : '(₹)'}
                    </label>
                    <input
                      type="number"
                      required
                      step="0.01"
                      min="0"
                      max={form.discount_type === 'percentage' ? '100' : undefined}
                      value={form.discount_value}
                      onChange={e => setForm({ ...form, discount_value: e.target.value })}
                      placeholder={form.discount_type === 'percentage' ? '25' : '500'}
                      className="bg-[#f5f5f7] border border-black/5 rounded-xl px-4 py-3 text-[0.9rem] outline-none focus:border-[#0071e3] transition-colors"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[0.7rem] font-bold uppercase tracking-[0.15em] text-[#86868b]">Min Order (₹)</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={form.min_order_amount}
                      onChange={e => setForm({ ...form, min_order_amount: e.target.value })}
                      placeholder="1000"
                      className="bg-[#f5f5f7] border border-black/5 rounded-xl px-4 py-3 text-[0.9rem] outline-none focus:border-[#0071e3] transition-colors"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[0.7rem] font-bold uppercase tracking-[0.15em] text-[#86868b]">Max Discount (₹)</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={form.max_discount_amount}
                      onChange={e => setForm({ ...form, max_discount_amount: e.target.value })}
                      placeholder="2000"
                      className="bg-[#f5f5f7] border border-black/5 rounded-xl px-4 py-3 text-[0.9rem] outline-none focus:border-[#0071e3] transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-[0.7rem] font-bold uppercase tracking-[0.15em] text-[#86868b]">Usage Limit</label>
                    <input
                      type="number"
                      min="1"
                      value={form.usage_limit}
                      onChange={e => setForm({ ...form, usage_limit: e.target.value })}
                      placeholder="Unlimited"
                      className="bg-[#f5f5f7] border border-black/5 rounded-xl px-4 py-3 text-[0.9rem] outline-none focus:border-[#0071e3] transition-colors"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[0.7rem] font-bold uppercase tracking-[0.15em] text-[#86868b]">Expires At</label>
                    <input
                      type="datetime-local"
                      value={form.expires_at}
                      onChange={e => setForm({ ...form, expires_at: e.target.value })}
                      className="bg-[#f5f5f7] border border-black/5 rounded-xl px-4 py-3 text-[0.9rem] outline-none focus:border-[#0071e3] transition-colors"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="coupon-active"
                    checked={form.is_active}
                    onChange={e => setForm({ ...form, is_active: e.target.checked })}
                    className="w-5 h-5 rounded accent-[#0071e3]"
                  />
                  <label htmlFor="coupon-active" className="text-[0.9rem] font-medium text-[#1d1d1f] cursor-pointer">Active</label>
                </div>

                <div className="flex gap-3 pt-4 border-t border-black/5">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="flex-1 px-6 py-3 bg-[#f5f5f7] text-[#1d1d1f] rounded-xl text-[0.85rem] font-semibold hover:bg-black/10 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 px-6 py-3 bg-[#0071e3] text-white rounded-xl text-[0.85rem] font-semibold hover:bg-[#0071e3]/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {saving && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>}
                    {saving ? 'Saving...' : (editingCoupon ? 'Update Coupon' : 'Create Coupon')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Coupons Table */}
        <div className="bg-white rounded-2xl border border-black/10 shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 rounded-full border-4 border-[#0071e3]/20 border-t-[#0071e3] animate-spin"></div>
            </div>
          ) : coupons.length === 0 ? (
            <div className="text-center py-20 text-[#86868b]">
              <span className="text-4xl block mb-4">🎫</span>
              <p className="text-[0.95rem] font-medium">No coupons yet</p>
              <p className="text-[0.8rem] mt-1">Create your first coupon to start offering discounts.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-black/10 bg-[#fbfbfd]">
                    <th className="text-left px-6 py-4 text-[0.65rem] font-bold uppercase tracking-[0.15em] text-[#86868b]">Code</th>
                    <th className="text-left px-6 py-4 text-[0.65rem] font-bold uppercase tracking-[0.15em] text-[#86868b]">Discount</th>
                    <th className="text-left px-6 py-4 text-[0.65rem] font-bold uppercase tracking-[0.15em] text-[#86868b] hidden lg:table-cell">Constraints</th>
                    <th className="text-center px-6 py-4 text-[0.65rem] font-bold uppercase tracking-[0.15em] text-[#86868b]">Usage</th>
                    <th className="text-left px-6 py-4 text-[0.65rem] font-bold uppercase tracking-[0.15em] text-[#86868b] hidden md:table-cell">Expires</th>
                    <th className="text-center px-6 py-4 text-[0.65rem] font-bold uppercase tracking-[0.15em] text-[#86868b]">Status</th>
                    <th className="text-right px-6 py-4 text-[0.65rem] font-bold uppercase tracking-[0.15em] text-[#86868b]">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {coupons.map(coupon => {
                    const expired = isExpired(coupon.expires_at);
                    const limitReached = coupon.usage_limit && coupon.used_count >= coupon.usage_limit;
                    const isDisabled = !coupon.is_active || expired || limitReached;

                    return (
                      <tr key={coupon.id} className={`border-b border-black/5 hover:bg-[#f5f5f7] transition-colors ${isDisabled ? 'opacity-60' : ''}`}>
                        <td className="px-6 py-5">
                          <span className="font-mono font-bold text-[0.95rem] text-[#1d1d1f] bg-[#f5f5f7] px-3 py-1.5 rounded-lg">{coupon.code}</span>
                          {coupon.description && (
                            <p className="text-[0.75rem] text-[#86868b] mt-2 max-w-[200px] truncate">{coupon.description}</p>
                          )}
                        </td>
                        <td className="px-6 py-5">
                          <span className="text-[1rem] font-bold text-[#0071e3]">
                            {coupon.discount_type === 'percentage' ? `${coupon.discount_value}%` : `₹${parseFloat(coupon.discount_value).toLocaleString()}`}
                          </span>
                          <p className="text-[0.7rem] text-[#86868b] mt-1">{coupon.discount_type === 'percentage' ? 'Percentage' : 'Fixed'}</p>
                        </td>
                        <td className="px-6 py-5 hidden lg:table-cell">
                          <div className="text-[0.75rem] text-[#86868b] space-y-1">
                            {coupon.min_order_amount && <p>Min: ₹{parseFloat(coupon.min_order_amount).toLocaleString()}</p>}
                            {coupon.max_discount_amount && <p>Max: ₹{parseFloat(coupon.max_discount_amount).toLocaleString()}</p>}
                            {!coupon.min_order_amount && !coupon.max_discount_amount && <p>No constraints</p>}
                          </div>
                        </td>
                        <td className="px-6 py-5 text-center">
                          <span className="text-[0.9rem] font-bold text-[#1d1d1f]">{coupon.used_count}</span>
                          <span className="text-[0.75rem] text-[#86868b]"> / {coupon.usage_limit || '∞'}</span>
                        </td>
                        <td className="px-6 py-5 hidden md:table-cell">
                          {coupon.expires_at ? (
                            <span className={`text-[0.8rem] ${expired ? 'text-[#ff3b30] font-bold' : 'text-[#1d1d1f]'}`}>
                              {expired ? '⏰ ' : ''}{formatDate(coupon.expires_at)}
                            </span>
                          ) : (
                            <span className="text-[0.8rem] text-[#86868b]">Never</span>
                          )}
                        </td>
                        <td className="px-6 py-5 text-center">
                          <button
                            onClick={() => handleToggleActive(coupon)}
                            className={`px-3 py-1.5 rounded-full text-[0.65rem] font-bold uppercase tracking-wider transition-all ${
                              coupon.is_active
                                ? expired || limitReached
                                  ? 'bg-amber-50 text-amber-600'
                                  : 'bg-green-50 text-green-600'
                                : 'bg-gray-100 text-gray-500'
                            }`}
                          >
                            {coupon.is_active ? (expired ? 'Expired' : limitReached ? 'Exhausted' : 'Active') : 'Inactive'}
                          </button>
                        </td>
                        <td className="px-6 py-5 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => openEditForm(coupon)}
                              className="px-3 py-2 bg-[#f5f5f7] rounded-lg text-[0.75rem] font-semibold text-[#1d1d1f] hover:bg-[#0071e3] hover:text-white transition-all"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(coupon.id)}
                              className="px-3 py-2 rounded-lg text-[0.75rem] font-semibold text-[#ff3b30] hover:bg-[#ff3b30]/10 transition-all"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
